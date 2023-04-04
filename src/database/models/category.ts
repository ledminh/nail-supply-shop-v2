import categoriesJSON from '../jsons/categories.json';
import type { Category } from '@/types/category';

type CategoryResponse = {
    success: true;
    data: Category[];
} | {
    success: false;
    message: string;
}


export function find(): Promise<CategoryResponse> {
    const categories: Category[] = categoriesJSON;

    return Promise.resolve({success: true, data: categories});
}