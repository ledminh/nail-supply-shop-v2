import productsJSON from '../jsons/products.json';
import type { Product, ProductGroup } from '@/types/product';


type findProps = {
    catID?: string;
    id?: string;
}

export function find({catID, id}:findProps) {
    
    let products: (Product|ProductGroup)[] = productsJSON;

    if(catID) {
        products = products.filter((product) => product.categoryID === catID);
        
        return Promise.resolve(products);
    }

    if(id) {
        const product = products.find((product) => product.id === id);
        
        if(product) 
            return Promise.resolve(product);
        else 
            return Promise.reject(new Error('Product not found'));
    }


    return Promise.reject(new Error('Something went wrong in database product.find'));
    
}

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