
import type { DBProduct, DBProductGroup } from "@/types/product";

import find, { FindProductOptions } from "./find";

import prismaClient from "../utils/prismaClient";
import toDBProduct from "../utils/toDBProduct";
import toDBProductGroup from "../utils/toDBProductGroup";

/******************************
 *  FIND PRODUCT/PRODUCT GROUP
 ******************************/

export { find };
export type { FindProductOptions };

/**********************************
 *  DELETE PRODUCT
 **********************************/
export type DeleteProductProps = {
  id: string;
};

export type DeleteProductResponse =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export function deleteProduct({ id}: DeleteProductProps): Promise<DeleteProductResponse> {
  return new Promise((resolve, reject) => {
    
    const _deleteProduct = async () => {
      const product = await prismaClient.product.delete({ where: { id } });

      await prismaClient.category.update({ where : { id: product.categoryID }, data: { numProducts: { decrement: 1 }, numProductsAndGroups: {decrement: 1} } });

      resolve({
        success: true
      });
    };

    _deleteProduct().catch((err) => {  reject({ success: false, message: err.message });

    });
  });

}

/**********************************
 *  DELETE GROUP
 **********************************/
export type DeleteGroupProps = {
  id: string;
};

export type DeleteGroupResponse =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export function deleteGroup({ id }: DeleteGroupProps): Promise<DeleteGroupResponse> {
  return new Promise((resolve, reject) => {
    
    // Define async
    const _delete = async () => {

      const numProductsDeleted = await prismaClient.$executeRaw`DELETE FROM "Product" WHERE "groupID" = ${id}`;
      const deletedGroup  = await prismaClient.group.delete({where: {id}});
      
      await prismaClient.category.update(
        { 
          where: { id: deletedGroup.categoryID }, 
          
          data: {
            numProductsAndGroups: { decrement: 1 },
            numProducts: { decrement: numProductsDeleted }
          }
        }
      );

      resolve({ success: true});

    }
    
    // Call async
    _delete().catch((err) => reject({ success: false, message: err.message }));
  
  });

}


/******************************
 *  ADD PRODUCT
 ******************************/

export type AddProductProps = {
  product: DBProduct;
};

export type AddProductResponse =
  { success: true; data: DBProduct; }
  | { success: false; message: string; };

export function addProduct({ product }: AddProductProps): Promise<AddProductResponse> {
  return new Promise((resolve, reject) => {

    const _add = async () => {

      const productData = {
        ...product,
        images: product.images.map(image => image.src)
      }

      const addProduct = prismaClient.product.create({data: productData});
      const incrementCategory = prismaClient.category.update({
        where: {
          id: product.categoryID
        },
        data: {
          numProducts: {
            increment: 1
          },
          numProductsAndGroups: {
            increment: 1
          }
        }
      });

      await prismaClient.$transaction([addProduct, incrementCategory]);

      const _product = await prismaClient.product.findUnique({ where: { id: product.id}});

      if (!_product) {
        return reject({ success: false, message: "Product not found" });
      }

      resolve({ success: true, data: toDBProduct(_product)});
    }

    _add().catch((err) => { reject({ success: false, message: err.message });});
  });
}


/******************************
 *  ADD GROUP
 ******************************/

export type AddGroupProps = {
  group: DBProductGroup;
};

export type AddGroupResponse =
  | {
      success: true;
      data: DBProductGroup;
    }
  | {
      success: false;
      message: string;
    };

export function addGroup({ group }: AddGroupProps): Promise<AddGroupResponse> {
  return new Promise((resolve, reject) => {
    
    const _addGroup = async () => {  
    
      const createGroup = prismaClient.group.create({
        data: {
          id: group.id,
          name: group.name,
          categoryID: group.categoryID,
        }
      });

      const createProducts = group.products.map(product => prismaClient.product.create({
        data: {
          ...product,
          images: product.images.map(image => image.src)
        }
      }));

      const updateCategory = prismaClient.category.update({
        where: {
          id: group.categoryID
        },
        data: {
          numProducts: {
            increment: group.products.length
          },
          numProductsAndGroups: {
            increment: 1
          }
        }
      });

      await prismaClient.$transaction([createGroup, ...createProducts, updateCategory]);
      
      const findGroup = prismaClient.group.findUnique({ where: { id: group.id}});
      const findProductsInGroup = prismaClient.product.findMany({ where: { groupID: group.id }});

      const [_group, _productsInGroup] = await Promise.all([findGroup, findProductsInGroup]);

      if (!_group) {
        return reject({ success: false, message: "Group not found" });
      }

      if (_productsInGroup.length === 0) {
        return reject({ success: false, message: "No products in group" });
      }

      return resolve({ success: true, data: toDBProductGroup(_group, _productsInGroup)});

    }

    _addGroup().catch((err) => { reject({ success: false, message: err.message });});

  });
}






/********************************
 * UPDATE PRODUCT
 ********************************/

export type UpdateProductProps = {
  product: DBProduct;
};

export type UpdateProductResponse =
  | {
      success: true;
      data: DBProduct;
    }
  | {
      success: false;
      message: string;
    };

export function updateProduct({
  product,
}: UpdateProductProps): Promise<UpdateProductResponse> {
  return new Promise((resolve, reject) => {

    prismaClient.product.update({
      where: {
        id: product.id
      },
      data: {
        ...product,
        images: product.images.map(image => image.src)
      }
    }).then((product) => {
      prismaClient.product.findUnique({
        where: { id: product.id}
      }).then((product) => {

        if (!product) {
          return reject({ success: false, message: "Product not found" });    
        }
        else{
          resolve({ success: true, data: toDBProduct(product)});
        }          
    }).catch(err => reject({ success: false, message: err.message }));

  });
  });
}

// /********************************
//  * UPDATE GROUP
//  * ******************************/

export type UpdateGroupProps = {
  group: DBProductGroup;
};

export type UpdateGroupResponse =
  | {
      success: true;
      data: DBProductGroup;
    }
  | {
      success: false;
      message: string;
    };

export function updateGroup({
  group,
}: UpdateGroupProps): Promise<UpdateGroupResponse> {
  return new Promise((resolve, reject) => {

    const _updateGroup = async () => {

    const deleteProducts = prismaClient.$executeRaw`DELETE FROM "Product" WHERE "groupID" = ${group.id};`;
    
    const createProducts = prismaClient.product.createMany({
      data: group.products.map(product => ({
        ...product,
        groupID: group.id,
        images: product.images.map(image => image.src)
      }))
    });

    const [numProductsDeleted] = await Promise.all([deleteProducts, createProducts]);



    await prismaClient.group.update({ 
      where: { id: group.id },
      data: {
        ...group,
        products: {
          connect: group.products.map(product => ({ id: product.id }))
        }
      }
    });

    await prismaClient.category.update({
      where: { id: group.categoryID },
      data: {
        numProducts: {
          increment: group.products.length - numProductsDeleted
        }
      }
    });


    const findGroup = prismaClient.group.findUnique({ where: { id: group.id}});
    const findProductsInGroup = prismaClient.product.findMany({ where: { groupID: group.id }});

    const [_group, _productsInGroup] = await Promise.all([findGroup, findProductsInGroup]);

    if (!_group) {
      return reject({ success: false, message: "Group not found" });
    }

    if (_productsInGroup.length === 0) {
      return reject({ success: false, message: "No products in group" });
    }

    return resolve({ success: true, data: toDBProductGroup(_group, _productsInGroup)});

  }

  _updateGroup().catch((err) => { reject({ success: false, message: err.message });});

  });



          
}   


// /********************************
//  * UPDATE GROUP PRODUCT
//  * ******************************/

export type UpdateGroupProductProps = {
  groupID: string;
  product: DBProduct;
};

export type UpdateGroupProductResponse =
  | {
      success: true;
      data: DBProduct;
    }
  | {
      success: false;
      message: string;
    };

export function updateGroupProduct({
  groupID,
  product,
}: UpdateGroupProductProps): Promise<UpdateGroupProductResponse> {

  return new Promise((resolve, reject) => {

    const _updateGroupProduct = async () => {

      const  _product  =  await prismaClient.product.update({ 
        where: { id: product.id },
        data: {
          ...product,
          groupID,
          images: product.images.map(image => image.src)
        }
      });


      if(!_product){
        return reject({ success: false, message: "Product not found" });
      }

      return resolve({ success: true, data: toDBProduct(_product)});

    }

    _updateGroupProduct().catch((err) => { reject({ success: false, message: err.message });});

  });
}


// /********************************
//  * UPDATE QUANTITY
//  * ******************************/

export type UpdateQuantityProps = {
  productID: string;
  quantity: number;
}[];

export type UpdateQuantityResponse = {
  success: true;
} | {
  success: false;
  message: string;
};

export function updateQuantity(quantityData: UpdateQuantityProps): Promise<UpdateQuantityResponse> {
  return new Promise((resolve, reject) => {

    prismaClient.product.findMany({
      where: {
        id: {
          in: quantityData.map(data => data.productID)
        }
      }
    }).then((products) => {
      if (!products) {
        return reject({
          success: false,
          message: "Products not found",
        });
      }

      const _products = products.filter((product) => {
        const data = quantityData.find((data) => data.productID === product.id);

        if (!data) {
          reject({success: false, message: "Product not found"});
          return false;
        }

        return true;
      });


      prismaClient.$transaction(
        _products.map((product) => {
          const data = quantityData.find((data) => data.productID === product.id) as UpdateQuantityProps[0];

          
          return prismaClient.product.update({
            where: {
              id: product.id
            },
            data: {
              sellCount: product.sellCount + data.quantity
            }
          });
        })
      ).then(() => {
        return resolve({ success: true });
      }).catch(err => reject({ success: false, message: err.message }));
    }).catch(err => reject({ success: false, message: err.message }));



  });
};  