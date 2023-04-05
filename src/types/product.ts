import { RemoteImage } from '@/types/image';
import { Item } from './item';



export type ProductImage = RemoteImage & Item;

export interface Product {
    id: string;
    name: string;
    price: number;
    images: ProductImage[];
    intro: string;
    details: string,
    categoryID: string
    groupID?: string,
    
}

export interface DBProduct extends Product {
    dateCreated: string,
    sellCount: number,
}


export interface ProductGroup {
    id: string;
    name: string;
    categoryID: string;
    products: Product[];
    
}

export interface DBProductGroup extends ProductGroup {
    products: DBProduct[],
    dateCreated: string,
}

export interface OrderedProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;

    image: RemoteImage;
}