import ordersJSON from '../jsons/orders.json';
import type { Order } from '@/types/order';




export function find() {
    const orders = ordersJSON;

    return Promise.resolve(orders);
}