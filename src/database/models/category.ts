import categoriesJSON from '../jsons/categories.json';
import type { Category } from '@/types/category';




export function find() {
    const categories: Category[] = categoriesJSON;

    return Promise.resolve(categories);
}