
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
    
    prismaClient.product.delete({
      where: {
        id: id
      }
    }).then((product) => {
      prismaClient.category.update({
        where: {
          id: product.categoryID
        },
        data: {
          numProducts: {
            decrement: 1
          }
        }
      }).then(() => {
        resolve({
          success: true
        });
      }).catch((err) => {
        reject({
          success: false,
          message: err.message
        });
      });

      
    }).catch((err) => {
      reject({
        success: false,
        message: err.message
      });
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

export function deleteGroup({
  id,
}: DeleteGroupProps): Promise<DeleteGroupResponse> {
  return new Promise((resolve, reject) => {
    prismaClient.group.delete({
      where: {
        id: id
      }
    }).then((group) => {
      prismaClient.category.update({
        where: {
          id: group.categoryID
        },
        data: {
          numProducts: {
            decrement: 1
          }
        }
      }).then(() => {
        prismaClient.product.deleteMany({
          where: {
            groupID: id
          }
        }).then(() => {

          resolve({
            success: true
          });

        }).catch((err) => {
          reject({
            success: false,
            message: err.message
          });
        });
      }).catch((err) => {
        reject({
          success: false,
          message: err.message
        });
      });

  }).catch((err) => {
    reject({
      success: false,
      message: err.message
    });
  });});

}

/******************************
 *  ADD PRODUCT
 ******************************/

export type AddProductProps = {
  product: DBProduct;
};

export type AddProductResponse =
  | {
      success: true;
      data: DBProduct;
    }
  | {
      success: false;
      message: string;
    };

export function addProduct({
  product,
}: AddProductProps): Promise<AddProductResponse> {
  return new Promise((resolve, reject) => {

    const productData = {
      ...product,
      images: product.images.map(image => image.src)
    }

    prismaClient.product.create({data: productData}).then((product) => {
      prismaClient.category.update({
        where: {
          id: product.categoryID
        },
        data: {
          numProducts: {
            increment: 1
          }
        }
      }).then(() => { prismaClient.product.findUnique({
          where: { id: product.id}
        }).then((product) => {

          if (!product) {
            return reject({ success: false, message: "Product not found" });
              
          }
          else{
            resolve({ success: true, data: toDBProduct(product)});
          }          
      }).catch(err => reject({ success: false, message: err.message }));
    }).catch(err =>  reject({ success: false, message: err.message }));

  });
}
)}

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
    prismaClient.group.create({
      data: {
        ...group,
        products: {
          create: group.products.map(product => ({
            ...product,
            groupID: group.id,
            images: product.images.map(image => image.src)
          }))
        }
      }
    }).then((group) => { prismaClient.category.update({ 
        where: { id: group.categoryID },
        data: {
          numProducts: {
            increment: 1
          }
        }
      }).then(() => { prismaClient.group.findUnique({
          where: { id: group.id}
        }).then((group) => {

          if (!group) {
            return reject({ success: false, message: "Group not found" });
              
          }
          else{
            prismaClient.product.findMany({ where: { groupID: group.id }})
            .then(products => resolve({ success: true, data: toDBProductGroup(group, products)}))
            .catch(err => reject({ success: false, message: err.message }));
          }          
      }).catch(err => reject({ success: false, message: err.message }));
    }).catch(err =>  reject({ success: false, message: err.message }));
  });
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
    // getDB().then((db) => {
    //   const { data } = db;

    //   if (!data) {
    //     return reject({
    //       success: false,
    //       message: "No database found",
    //     });
    //   }

    //   const { PRODUCTS } = data;

    //   const index = PRODUCTS.findIndex((p) => p.id === product.id);

    //   if (index === -1) {
    //     return reject({
    //       success: false,
    //       message: "Product not found",
    //     });
    //   }

    //   PRODUCTS[index] = product;

    //   db.write()
    //     .then(() => db.read())
    //     .then(() => {
    //       if (!db.data) {
    //         return reject({
    //           success: false,
    //           message: "No database found",
    //         });
    //       }

    //       const { PRODUCTS } = db.data;

    //       const _product = PRODUCTS.find((p) => p.id === product.id);

    //       if (!_product) {
    //         return reject({
    //           success: false,
    //           message: "Product not found",
    //         });
    //       }

    //       return resolve({ success: true, data: _product as DBProduct });
    //     });
    // });
    // rewrite with prisma

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

    prismaClient.$transaction([
      prismaClient.product.deleteMany({ where: { groupID: group.id } }),
      prismaClient.product.createMany({ 
          data: group.products.map(product => ({
          ...product,
          groupID: group.id,
          images: product.images.map(image => image.src)
        }))
      })
    ]).then(() => {
      prismaClient.group.update({
        where: {
          id: group.id
        },
        data: {
          ...group,
          products: {
            connect: group.products.map(product => ({ id: product.id }))
          }
        }
      }).then((group) => {
        prismaClient.group.findUnique({
          where: { id: group.id}
        }).then((group) => {

          if (!group) {
            return reject({ success: false, message: "Group not found" });
          }
          else{
            prismaClient.product.findMany({
              where: { groupID: group.id}
            }).then((products) => {
              if (!products) {
                return reject({ success: false, message: "Products not found" });
              }
              else {
                return resolve({ success: true, data: toDBProductGroup(group, products)});
              }
            }).catch(err => reject({ success: false, message: err.message }));
          }
        }).catch(err => reject({ success: false, message: err.message }));
      });
    }).catch(err => reject({ success: false, message: err.message }));

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
    prismaClient.product.update({
      where: {
        id: product.id
      },
      data: {
        ...product,
        groupID,
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
          return resolve({ success: true, data: toDBProduct(product)});
        }
      }).catch(err => reject({ success: false, message: err.message }));
    }).catch(err => reject({ success: false, message: err.message }));
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