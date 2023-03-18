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
    categoryInfo: {
        name: string,
        slug: string
    },
    
    groupName?: string,
    otherProducts?: Product[],
}

export interface ProductGroup {
    id: string;
    name: string;
    products: Product[];
}

export interface OrderedProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;

    image: RemoteImage;
}