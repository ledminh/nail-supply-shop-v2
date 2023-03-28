import  * as CategoryModel  from './models/category';
import * as ProductModel  from './models/product';


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
        const products = ProductModel.find({catID: catID});
        return products;
    }

    throw new Error('Something went wrong in database/getProducts');
}

/**************************
 * getProduct
 */

type getProductProps = {
    id: string;
}

export function getProduct({id}:getProductProps) {

    const product = ProductModel.find({id});

    return product;
}


/**************************
 * deleteProduct
 */

type deleteProductProps = {
    id: string;
}

export function deleteProduct({id}:deleteProductProps) {
    return ProductModel.deleteProduct({id});
}