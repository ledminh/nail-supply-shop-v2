import { orderStatus } from '@/config';
import ordersJSON from '../jsons/orders.json';
import type { FilterOrder, Order, StatusValue } from '@/types/order';


const orders:Order[] = ordersJSON as Order[];



export function find() {

    return Promise.resolve(orders);
}

export function deleteOrder(id: string) {
    const order = orders.find((order) => order.id === id);

    if(!order) {
        return Promise.reject(new Error('Order not found'));
    }

    const index = orders.indexOf(order);

    orders.splice(index, 1);

    return Promise.resolve(order);
}

export function updateOrderStatus(id: string, status: StatusValue) {
    const order = orders.find((order) => order.id === id);

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

export function filterOrders({status, month, year, sort, query}: FilterOrder) {
    if(query !== '') {
        return Promise.resolve(orders.filter((order) => {
            return order.id.includes(query);
        }));
    }

    let filteredOrders = orders;

    if(status !== 'all') {
        filteredOrders = filteredOrders.filter((order) => order.status.value === status);

    }


    if(month !== null) {
        
        filteredOrders = filteredOrders.filter((order) => {
            const date = new Date(order.status.lastUpdated);
            const month = (date.getMonth() + 1).toString();
            const year = date.getFullYear().toString();


            return date.getMonth().toString() === month + '/' + year;
        });
    }

    console.log(filteredOrders);

    if(year !== null) {
        filteredOrders = filteredOrders.filter((order) => {
            const date = new Date(order.status.lastUpdated);
            return date.getFullYear().toString() === year;
        });
    }

    if(sort === 'newest') {
        filteredOrders = filteredOrders.sort((a, b) => {
            const dateA = new Date(a.status.lastUpdated);
            const dateB = new Date(b.status.lastUpdated);

            return dateA.getTime() - dateB.getTime();
        });
    } else if(sort === 'oldest') {
        filteredOrders = filteredOrders.sort((a, b) => {
            const dateA = new Date(a.status.lastUpdated);
            const dateB = new Date(b.status.lastUpdated);

            return dateB.getTime() - dateA.getTime();
        });
    }




    return Promise.resolve(filteredOrders);
}