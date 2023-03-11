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