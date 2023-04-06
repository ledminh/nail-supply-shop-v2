import categoriesJSON from '../jsons/categories.json';
import type { Category } from '@/types/category';

const CATEGORIES: Category[] = categoriesJSON.map((category) => ({
    ...category,
    numProducts: parseInt(category.numProducts)
}));

type CategoryResponse = {
    success: true;
    data: Category[];
} | {
    success: false;
    message: string;
}


export function find(): Promise<CategoryResponse> {

    return Promise.resolve({success: true, data: CATEGORIES});
}