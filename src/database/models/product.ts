import productsJSON from '../jsons/products.json';
import categoryJSON from '../jsons/categories.json';

import type { DBProduct, DBProductGroup } from '@/types/product';
import type { Category } from '@/types/category';

const CATEGORIES = categoryJSON as Category[];
const PRODUCTS = productsJSON as (DBProduct|DBProductGroup)[];


/******************************
 *  FIND PRODUCT/PRODUCT GROUP
 ******************************/
type FindProductResponse = {
    success: true;
    data: DBProduct|DBProductGroup| (DBProduct|DBProductGroup)[];
} | {
    success: false;
    message: string;
}


type findProps = {
    catID?: string;
    id?: string;
    catSlug?: string;
}

export function find({catID, catSlug, id}:findProps):Promise<FindProductResponse> {
    
    let products: (DBProduct|DBProductGroup)[] = [];

    if(catID) {
        products = PRODUCTS.filter((product) => product.categoryID === catID);
        
        return Promise.resolve({
            success: true,
            data: products
        });
    }

    if(catSlug) {
        const category = CATEGORIES.find((category) => category.slug === catSlug);

        if(category) {
            products = PRODUCTS.filter((product) => product.categoryID === category.id);
            return Promise.resolve({
                success: true,
                data: products
            });
        } else {
            return Promise.reject({
                success: false,
                message: 'Category not found'
            });
        }
    }


    if(id) {
        const product = products.find((product) => product.id === id);
        
        if(product) 
            return Promise.resolve({
                success: true,
                data: product
            });
        else 
            return Promise.reject({
                success: false,
                message: 'Product not found'
            });
    }



    return Promise.reject({
        success: false,
        message: 'Product not found'
    });
    
}


/**********************************
 *  DELETE PRODUCT / PRODUCT GROUP
 **********************************/

type deleteProductProps = {
    id: string;
}

export function deleteProduct({id}:deleteProductProps) {
    const product = productsJSON.find((product) => product.id === id);

    if(product) {
        const index = productsJSON.indexOf(product);
        productsJSON.splice(index, 1);

        return Promise.resolve();
    }

    return Promise.reject(new Error('Product not found'));
}


/******************************
 *  ADD PRODUCT
 ******************************/

type addProductProps = {
    product: DBProduct;
}

export function addProduct({product}:addProductProps) {
    productsJSON.push(product);
    return Promise.resolve();
}


/******************************
 *  ADD GROUP
 ******************************/

type addGroupProps = {
    group: DBProductGroup;
}

export function addGroup({group}:addGroupProps) {
    productsJSON.push(group);
    return Promise.resolve(group);
}

/********************************
 * UPDATE PRODUCT
 ********************************/

type updateProductProps = {
    product: DBProduct;
}

export function updateProduct({product}:updateProductProps) {
    const _product = productsJSON.find((product) => product.id === product.id);

    if(_product) {
        const index = productsJSON.indexOf(_product);
        productsJSON[index] = product;

        return Promise.resolve(product);
    }

    return Promise.reject(new Error('Product not found'));
}

/********************************
 * UPDATE GROUP
 * ******************************/

type updateGroupProps = {
    group: DBProductGroup;
}

export function updateGroup({group}:updateGroupProps) {
    const _group = productsJSON.find((group) => group.id === group.id);

    if(_group) {
        const index = productsJSON.indexOf(_group);
        productsJSON[index] = group;

        return Promise.resolve(group);
    }

    return Promise.reject(new Error('Group not found'));
}

/********************************
 * UPDATE GROUP PRODUCT
 * ******************************/

type updateGroupProductProps = {
    groupID: string;
    product: DBProduct;
}

export function updateGroupProduct({groupID, product}:updateGroupProductProps) {
    const group = productsJSON.find((group) => group.id === groupID);

    if(group && isDBGroupProduct(group)) {
        const _product = group.products.find((product) => product.id === product.id);

        if(_product) {
            const index = group.products.indexOf(_product);
            group.products[index] = product;

            return Promise.resolve(product);
        }

        return Promise.reject(new Error('Product not found'));
    }

    return Promise.reject(new Error('Group not found'));
}


const isDBGroupProduct = (group: DBProductGroup|DBProduct): group is DBProductGroup => {
    return (group as DBProductGroup).products !== undefined;
}