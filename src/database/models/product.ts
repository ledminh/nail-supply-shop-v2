import productsJSON from '../jsons/products.json';
import categoryJSON from '../jsons/categories.json';

import type { DBProduct, DBProductGroup } from '@/types/product';
import type { Category } from '@/types/category';
import { SortType, SortedOrderType } from '@/types/list-conditions';
import isProduct from '@/utils/isProduct';

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


export type FindProductOptions = {
    catID?: string, catSlug?: string, sort?: SortType, sortedOrder?: SortedOrderType, offset?: number, limit?: number, id?: string
}

export function find(options: FindProductOptions):Promise<FindProductResponse> {
    let products = PRODUCTS;
    
    if(options.id) {
        const product = PRODUCTS.find((product) => product.id === options.id);

        if(product) {
            return Promise.resolve({success: true, data: product});
        }

        return Promise.reject({success: false, message: 'Product not found'});
    }

    if(options.catID) {
        products = products.filter((product) => product.categoryID === options.catID);
    }

    if(options.catSlug) {
        const category = CATEGORIES.find((category) => category.slug === options.catSlug);

        if(category) {
            products = products.filter((product) => product.categoryID === category.id);
        }
    }

    if(options.sort) {
        products = products.sort((a, b) => {
            if(options.sort === 'name') {
                if(a.name < b.name) {
                    return -1;
                }
                if(a.name > b.name) {
                    return 1;
                }
                return 0;
            }
            else if(options.sort === 'price') {
                const aPrice = isProduct(a)?  a.price : a.products[0].price;
                const bPrice = isProduct(b)?  b.price : b.products[0].price;

                if(aPrice < bPrice) {
                    return -1;
                }
                if(aPrice > bPrice) {
                    return 1;
                }
                return 0;
            }
            else if (options.sort === 'dateCreated') {
                const aDate = new Date(a.dateCreated);
                const bDate = new Date(b.dateCreated);

                if(aDate < bDate) {
                    return -1;
                }
                if(aDate > bDate) {
                    return 1;
                }
                return 0;
            }
            else if (options.sort === 'sellCount') {
                const aSellCount = isProduct(a)?  a.sellCount : a.products[0].sellCount;
                const bSellCount = isProduct(b)?  b.sellCount : b.products[0].sellCount;

                if(aSellCount < bSellCount) {
                    return -1;
                }
                if(aSellCount > bSellCount) {
                    return 1;
                }
                return 0;
            }
            else {
                return 0;
            }
            
        });
    }

    if(options.sortedOrder === 'desc') {
        products = products.reverse();
    }

    if(options.offset) {
        products = products.slice(options.offset);
    }

    if(options.limit) {
        products = products.slice(0, options.limit);
    }

    return Promise.resolve({success: true, data: products});
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