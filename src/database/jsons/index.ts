import type { Order } from '@/types/order';
import ordersJSON from './orders.json';

// a small storage database for testing purposes
export const ordersStore = {
    ORDERS: ordersJSON as Order[],
    ORDER_TEMPS: [] as Order[],
};

