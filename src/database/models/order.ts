import { orderStatus } from '@/config';

import {ordersStore} from '@/database/jsons';

import type { FilterOrder, Order, StatusValue } from '@/types/order';


const {ORDERS, ORDER_TEMPS} = ordersStore;


type OrderResponse = Promise<{
    success: true;
    data: Order | Order[];
}|{
    success: false;
    message: string;
}>;

export function find() {

    return Promise.resolve(ORDERS);
}

export function deleteOrder(id: string) {
    const order = ORDERS.find((order) => order.id === id);

    if(!order) {
        return Promise.reject(new Error('Order not found'));
    }

    const index = ORDERS.indexOf(order);

    ORDERS.splice(index, 1);

    return Promise.resolve(order);
}

export function add(order: Order):OrderResponse {
    ORDERS.push(order);

    return Promise.resolve({
        success: true,
        data: order
    });
}

export function updateStatus(id: string, status: StatusValue) {
    const order = ORDERS.find((order) => order.id === id);

    if(!order) {
        return Promise.reject(new Error('Order not found'));
    }

    order.status = {
        value: status,
        lastUpdated: new Date().toISOString(),
        description: orderStatus[status]
    };

    return Promise.resolve(order);
}

export function filter({status, month, year, sort, query}: FilterOrder) {
    if(query !== '') {
        return Promise.resolve(ORDERS.filter((order) => {
            return order.id.includes(query);
        }));
    }

    let filteredOrders = ORDERS;

    if(status !== 'all') {
        filteredOrders = filteredOrders.filter((order) => order.status.value === status);

    }



    if(month !== null) {
        
        filteredOrders = filteredOrders.filter((order) => {
            const date = new Date(order.status.lastUpdated);
            const lastUpdatedMonth = (date.getMonth() + 1).toString();
            const lastUpdatedYear = date.getFullYear().toString();

            const monthQuery = month.substring(0, month.indexOf('/'));
            const yearQuery = month.substring(month.indexOf('/') + 1);
            

            return lastUpdatedMonth === monthQuery && lastUpdatedYear === yearQuery;
        });


    }


    if(year !== null) {
        filteredOrders = filteredOrders.filter((order) => {
            const date = new Date(order.status.lastUpdated);
            return date.getFullYear().toString() === year;
        });
    }

    if(sort === 'oldest') {
        filteredOrders = filteredOrders.sort((a, b) => {
            const dateA = new Date(a.status.lastUpdated);
            const dateB = new Date(b.status.lastUpdated);

            return dateA.getTime() - dateB.getTime();
        });
    } else if(sort === 'newest') {
        filteredOrders = filteredOrders.sort((a, b) => {
            const dateA = new Date(a.status.lastUpdated);
            const dateB = new Date(b.status.lastUpdated);

            return dateB.getTime() - dateA.getTime();
        });
    }




    return Promise.resolve(filteredOrders);
}


/*************************
 * Temp Order Functions
 */

type TempOrderResponse = Promise<{
    success: true;
    data: Order;
}| {
    success: false;
    message: string;
}>

export function saveTemp(order: Order): TempOrderResponse {
    ORDER_TEMPS.push(order);

    
    return Promise.resolve({
        success: true,
        data: order
    });
}


export function findTemp(id: string): TempOrderResponse {
    const order = ORDER_TEMPS.find((order) => order.id === id);
    
 
    if(!order) {
        return Promise.resolve({
            success: false,
            message: 'Order not found'
        });
    }

    return Promise.resolve({
        success: true,
        data: order
    });
}

export function deleteTemp(id: string): TempOrderResponse {
    const order = ORDER_TEMPS.find((order) => order.id === id);

 
    if(!order) {
        return Promise.resolve({
            success: false,
            message: 'Order not found'
        });
    }

    const index = ORDER_TEMPS.indexOf(order);

    ORDER_TEMPS.splice(index, 1);

    return Promise.resolve({
        success: true,
        data: order
    });
}