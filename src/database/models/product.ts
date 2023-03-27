import productsJSON from '../jsons/products.json';
import type { Product, ProductGroup } from '@/types/product';



type findProps = {
    catID?: string;
}
export function find({catID}:findProps) {

    let products: (Product|ProductGroup)[] = productsJSON;

    if(catID) {
        products = products.filter((product) => product.categoryID === catID);
    }


    return Promise.resolve(products);
}