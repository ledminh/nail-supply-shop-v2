import { RemoteImage } from '@/types/image';
import { Item } from './item';

type ProductImage = RemoteImage & Item;

export interface Product {
    id: string;
    name: string;
    price: number;
    intro: string;
    images: ProductImage[];
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