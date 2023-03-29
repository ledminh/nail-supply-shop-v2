import  * as CategoryModel  from './models/category';
import * as ProductModel  from './models/product';

import type { DBProduct, DBProductGroup } from '@/types/product';


/**********************
 * getCategories
 */

type getCategoriesProps = {
    
};

export function getCategories({}:getCategoriesProps) {
    const categories = CategoryModel.find();
    return categories;
}



/**************************
 * getProducts
 */

type getProductsProps = {
    catID?: string;
}

export function getProducts({catID}:getProductsProps) {

    if(catID) {
        return ProductModel.find({catID: catID});
    }

    return Promise.reject(new Error('Something went wrong in database/getProducts'));
}

/**************************
 * getProduct
 */

type getProductProps = {
    id: string;
}

export const getProduct = ({id}:getProductProps) => ProductModel.find({id});



/**************************
 * deleteProduct
 */

type deleteProductProps = {
    id: string;
}

export function deleteProduct({id}:deleteProductProps) {
    return ProductModel.deleteProduct({id});
}



/*****************************
 * addProduct
 */

type addProductProps = {
    product: DBProduct;
}

export function addProduct({product}:addProductProps) {
    return ProductModel.addProduct({product});
}


/*****************************
 * addGroup
 */

type addGroupProps = {
    group: DBProductGroup;
}

export function addGroup({group}:addGroupProps) {
    return ProductModel.addGroup({group});
}

/*****************************
 * updateProduct
 *****************************/

type updateProductProps = {
    product: DBProduct;
}

export function updateProduct({product}:updateProductProps) {
    return ProductModel.updateProduct({product});
}

/*****************************
 * updateGroup
 ******************************/

type updateGroupProps = {
    group: DBProductGroup;
}

export function updateGroup({group}:updateGroupProps) {
    return ProductModel.updateGroup({group});
}

/*****************************
 * updateGroupProduct
 ******************************/

type updateGroupProductProps = {
    groupID: string;
    product: DBProduct;
}

export function updateGroupProduct({groupID, product}:updateGroupProductProps) {
    return ProductModel.updateGroupProduct({groupID, product});
}