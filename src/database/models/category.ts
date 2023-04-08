import categoriesJSON from '../jsons/categories.json';
import type { Category } from '@/types/category';
import { getDB }  from '../jsons';




type Response<T> = {
    success: true;
    data: T;
} | {
    success: false;
    message: string;
}

type CategoryResponse = Response<Category> | Response<Category[]>;

type FindProps = {
    id?: string;
};


export function find({id}:FindProps): Promise<CategoryResponse> {

    if(id) {
        return new Promise((resolve, reject) => {
            getDB().then((db) => {
                const {data} = db;
    
                if(!data) {
                    return reject({
                        success: false,
                        message: 'No orders found'
                    });
                }
    
                const {CATEGORIES} = data;
    
                const category = CATEGORIES.find((cat) => cat.id === id);
    
                if(!category) {
                    return reject({
                        success: false,
                        message: 'Order not found'
                    });
                }
    
                resolve({
                    success: true,
                    data: category
                });
            });
        });    
    }

    return new Promise((resolve, reject) => {
        getDB().then((db) => {
            const {data} = db;

            if(!data) {
                return reject({
                    success: false,
                    message: 'No orders found'
                });
            }

            resolve({
                success: true,
                data: data.CATEGORIES
            });
        });
    });
}