import productsJSON from "@/database/jsons/products.json";
import categoryJSON from "@/database/jsons/categories.json";

import type { DBProduct, DBProductGroup } from "@/types/product";

import find, {FindProductOptions} from "./find";

import { getDB } from "@/database/jsons";

const PRODUCTS = productsJSON as (DBProduct | DBProductGroup)[];

/******************************
 *  FIND PRODUCT/PRODUCT GROUP
 ******************************/

export {find};
export type {FindProductOptions};

/**********************************
 *  DELETE PRODUCT
 **********************************/
export type DeleteProductProps = {
  id: string;
};

export type DeleteProductResponse = {
  success: true;
} | {
  success: false;
  message: string;
};

export function deleteProduct({ id }: DeleteProductProps):Promise<DeleteProductResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { PRODUCTS, CATEGORIES } = data;


      const index = PRODUCTS.findIndex((product) => product.id === id);


      if (index === -1) {
        return reject({
          success: false,
          message: "Product not found",
        });
      }

            
      const category = CATEGORIES.find((category) => category.id === PRODUCTS[index].categoryID);

      if (!category) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }

      category.numProducts -= 1;

      PRODUCTS.splice(index, 1);


      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No database found",
            });
          }

          const { PRODUCTS } = db.data;

          const index = PRODUCTS.findIndex((product) => product.id === id);

          if (index === -1) {
            return resolve({ success: true });
          }

          return reject({
            success: false,
            message: "Product not deleted",
          });
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

export type DeleteGroupResponse = {
  success: true;
} | {
  success: false;
  message: string;
};

export function deleteGroup({ id }: DeleteGroupProps):Promise<DeleteGroupResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { PRODUCTS, CATEGORIES } = data;


      const index = PRODUCTS.findIndex((product) => product.id === id);


      if (index === -1) {
        return reject({
          success: false,
          message: "Product not found",
        });
      }

            
      const category = CATEGORIES.find((category) => category.id === PRODUCTS[index].categoryID);

      if (!category) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }

      category.numProducts -= 1;

      PRODUCTS.splice(index, 1);


      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No database found",
            });
          }

          const { PRODUCTS } = db.data;

          const index = PRODUCTS.findIndex((product) => product.id === id);

          if (index === -1) {
            return resolve({ success: true });
          }

          return reject({
            success: false,
            message: "Product not deleted",
          });
        });
    });
  });
}




/******************************
 *  ADD PRODUCT
 ******************************/

export type AddProductProps = {
  product: DBProduct;
};

export type AddProductResponse = {
  success: true;
  data: DBProduct;
} | {
  success: false;
  message: string;
};

export function addProduct({ product }: AddProductProps):Promise<AddProductResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { PRODUCTS, CATEGORIES } = data;

      const category = CATEGORIES.find((category) => category.id === product.categoryID);

      if (!category) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }


      PRODUCTS.push(product);
      category.numProducts += 1;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No database found",
            });
          }

          const { PRODUCTS } = db.data;

          const _product = PRODUCTS.find((p) => p.id === product.id);

          if (!_product) {
            return reject({
              success: false,
              message: "Product not found",
            });
          }

          
          return resolve({ success: true, data: _product as DBProduct });
        })
    });
  });
}

/******************************
 *  ADD GROUP
 ******************************/

export type AddGroupProps = {
  group: DBProductGroup;
};


export type AddGroupResponse = {
  success: true;
  data: DBProductGroup;
} | {
  success: false;
  message: string;
};

export function addGroup({ group }: AddGroupProps):Promise<AddGroupResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { PRODUCTS, CATEGORIES } = data;

      const category = CATEGORIES.find((category) => category.id === group.categoryID);

      if (!category) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }

      PRODUCTS.push(group);
      category.numProducts += 1;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No database found",
            });
          }

          const { PRODUCTS } = db.data;

          const _group = PRODUCTS.find((p) => p.id === group.id);

          if (!_group) {
            return reject({
              success: false,
              message: "Group not found",
            });
          }

          
          return resolve({ success: true, data: _group as DBProductGroup });
        })
    });
  });
}

/********************************
 * UPDATE PRODUCT
 ********************************/

export type UpdateProductProps = {
  product: DBProduct;
};

export type UpdateProductResponse = {
  success: true;
  data: DBProduct;
} | {
  success: false;
  message: string;
};

export function updateProduct({ product }: UpdateProductProps):Promise<UpdateProductResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { PRODUCTS } = data;

      const index = PRODUCTS.findIndex((p) => p.id === product.id);

      if (index === -1) {
        return reject({
          success: false,
          message: "Product not found",
        });
      }

      PRODUCTS[index] = product;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No database found",
            });
          }

          const { PRODUCTS } = db.data;

          const _product = PRODUCTS.find((p) => p.id === product.id);

          if (!_product) {
            return reject({
              success: false,
              message: "Product not found",
            });
          }

          return resolve({ success: true, data: _product as DBProduct });
        });
    });
  });
}

/********************************
 * UPDATE GROUP
 * ******************************/

export type UpdateGroupProps = {
  group: DBProductGroup;
};

export type UpdateGroupResponse = {
  success: true;
  data: DBProductGroup;
} | {
  success: false;
  message: string;
};


export function updateGroup({ group }: UpdateGroupProps):Promise<UpdateGroupResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { PRODUCTS } = data;

      const index = PRODUCTS.findIndex((p) => p.id === group.id);

      if (index === -1) {
        return reject({
          success: false,
          message: "Group not found",
        });
      }



      PRODUCTS[index] = group;


      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No database found",
            });
          }

          const { PRODUCTS } = db.data;

          const _group = PRODUCTS.find((p) => p.id === group.id);

          if (!_group) {
            return reject({
              success: false,
              message: "Group not found",
            });
          }

          return resolve({ success: true, data: _group as DBProductGroup });
        });
    });
  });
}

/********************************
 * UPDATE GROUP PRODUCT
 * ******************************/

export type UpdateGroupProductProps = {
  groupID: string;
  product: DBProduct;
};

export type UpdateGroupProductResponse = {
  success: true;
  data: DBProduct;
} | {
  success: false;
  message: string;
};

export function updateGroupProduct({ groupID, product}: UpdateGroupProductProps):Promise<UpdateGroupProductResponse>  {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { PRODUCTS } = data;

      const group = PRODUCTS.find((p) => p.id === groupID);

      if (!group) {
        return reject({
          success: false,
          message: "Group not found",
        });
      }

      if (!isDBGroupProduct(group)) {
        return reject({
          success: false,
          message: "Group is not a group",
        });
      }

      const index = group.products.findIndex((p) => p.id === product.id);

      if (index === -1) {
        return reject({
          success: false,
          message: "Product not found",
        });
      }

      group.products[index] = product;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No database found",
            });
          }

          const { PRODUCTS } = db.data;

          const _group = PRODUCTS.find((p) => p.id === groupID);

          if (!_group) {
            return reject({
              success: false,
              message: "Group not found",
            });
          }

          if (!isDBGroupProduct(_group)) {
            return reject({
              success: false,
              message: "Group is not a group",
            });
          }

          const _product = _group.products.find((p) => p.id === product.id);

          if (!_product) {
            return reject({
              success: false,
              message: "Product not found",
            });
          }

          return resolve({ success: true, data: _product as DBProduct });
        });
    });
  });
}

const isDBGroupProduct = (
  group: DBProductGroup | DBProduct
): group is DBProductGroup => {
  return (group as DBProductGroup).products !== undefined;
};
