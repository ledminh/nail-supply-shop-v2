import productsJSON from "@/database/jsons/products.json";
import categoryJSON from "@/database/jsons/categories.json";

import type { DBProduct, DBProductGroup } from "@/types/product";

import find, {FindProductOptions} from "./find";



const PRODUCTS = productsJSON as (DBProduct | DBProductGroup)[];

/******************************
 *  FIND PRODUCT/PRODUCT GROUP
 ******************************/

export {find};
export type {FindProductOptions};

/**********************************
 *  DELETE PRODUCT / PRODUCT GROUP
 **********************************/

type deleteProductProps = {
  id: string;
};

export function deleteProduct({ id }: deleteProductProps) {
  const product = productsJSON.find((product) => product.id === id);

  if (product) {
    const index = productsJSON.indexOf(product);
    productsJSON.splice(index, 1);

    return Promise.resolve();
  }

  return Promise.reject(new Error("Product not found"));
}

/******************************
 *  ADD PRODUCT
 ******************************/

type addProductProps = {
  product: DBProduct;
};

export function addProduct({ product }: addProductProps) {
  productsJSON.push(product);
  return Promise.resolve();
}

/******************************
 *  ADD GROUP
 ******************************/

type addGroupProps = {
  group: DBProductGroup;
};

export function addGroup({ group }: addGroupProps) {
  PRODUCTS.push(group);
  return Promise.resolve(group);
}

/********************************
 * UPDATE PRODUCT
 ********************************/

type updateProductProps = {
  product: DBProduct;
};

export function updateProduct({ product }: updateProductProps) {
  const _product = PRODUCTS.find((product) => product.id === product.id);

  if (_product) {
    const index = PRODUCTS.indexOf(_product);
    PRODUCTS[index] = product;

    return Promise.resolve(product);
  }

  return Promise.reject(new Error("Product not found"));
}

/********************************
 * UPDATE GROUP
 * ******************************/

type updateGroupProps = {
  group: DBProductGroup;
};

export function updateGroup({ group }: updateGroupProps) {
  const _group = productsJSON.find((group) => group.id === group.id);

  if (_group) {
    const index = PRODUCTS.indexOf(_group);
    PRODUCTS[index] = group;

    return Promise.resolve(group);
  }

  return Promise.reject(new Error("Group not found"));
}

/********************************
 * UPDATE GROUP PRODUCT
 * ******************************/

type updateGroupProductProps = {
  groupID: string;
  product: DBProduct;
};

export function updateGroupProduct({
  groupID,
  product,
}: updateGroupProductProps) {
  const group = PRODUCTS.find((group) => group.id === groupID);

  if (group && isDBGroupProduct(group)) {
    const _product = group.products.find(
      (product) => product.id === product.id
    );

    if (_product) {
      const index = group.products.indexOf(_product);
      group.products[index] = product;

      return Promise.resolve(product);
    }

    return Promise.reject(new Error("Product not found"));
  }

  return Promise.reject(new Error("Group not found"));
}

const isDBGroupProduct = (
  group: DBProductGroup | DBProduct
): group is DBProductGroup => {
  return (group as DBProductGroup).products !== undefined;
};
