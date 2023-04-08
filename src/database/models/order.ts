import { orderStatus } from '@/config';
import { getDB }  from '../jsons';

import type { FilterOrder, Order, StatusValue } from '@/types/order';



type OrderResponse = Promise<{
    success: true;
    data: Order | Order[];
}|{
    success: false;
    message: string;
}>;



type FindProps = {
    id?: string;
};

export function find({id}:FindProps):OrderResponse {


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
    
                const {ORDERS} = data;
    
                const order = ORDERS.find((order) => order.id === id);
    
                if(!order) {
                    return reject({
                        success: false,
                        message: 'Order not found'
                    });
                }
    
                resolve({
                    success: true,
                    data: order
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
                data: data.ORDERS
            });
        });
    });


    

    
}

    


export function deleteOrder(id: string):OrderResponse {
    return new Promise((resolve, reject) => {
        getDB().then((db) => {
            const {data} = db;

            if(!data) {
                return reject({
                    success: false,
                    message: 'No orders found'
                });
            }

            const {ORDERS} = data;

            const index = ORDERS.findIndex((order) => order.id === id);

            if(index === -1) {
                return reject({
                    success: false,
                    message: 'Order not found'
                });
            }

            ORDERS.splice(index, 1);

            db.write().then(() => db.read()).then(() => {
                if(!db.data)
                    return reject({
                        success: false,
                        message: 'No orders found'
                    });

                resolve({
                    success: true,
                    data: db.data.ORDERS
                });            
        });
    });
});
}

export function add(order: Order):OrderResponse {
    return new Promise(async (resolve, reject) => {
        const db = await getDB();

        if (!db.data) {
            return reject({
                success: false,
                message: 'No orders found',
            });
        }

        const { ORDERS } = db.data;

        ORDERS.push(order);

        db.write()
            .then(() => db.read())
            .then(() => {
                if (!db.data)
                    return reject({
                        success: false,
                        message: "No orders found",
                    });


                resolve({
                    success: true,
                    data: order,
                });
            });

    });
}

export function updateStatus(id: string, status: StatusValue):OrderResponse {
    return new Promise((resolve, reject) => {
        getDB()
            .then((db) => {
                const { data } = db;
        
                if (!data) {
                    return reject({
                    success: false,
                    message: "No orders found",
                    });
                }
        
                const { ORDERS } = data;
        
                const index = ORDERS.findIndex((order) => order.id === id);
        
                if (index === -1) {
                    return reject({
                    success: false,
                    message: "Order not found",
                    });
                }
        
                ORDERS[index].status = {
                    value: status,
                    lastUpdated: new Date().toISOString(),
                    description: orderStatus[status],
                };
        
                db
                    .write()
                    .then(() => db.read())
                    .then(() => {
                        if (!db.data)
                            return reject({
                            success: false,
                            message: "No orders found",
                            });
            
                        resolve({
                            success: true,
                            data: ORDERS[index],
                        });
                    });
            })
            .catch((error) => {
                reject({
                    success: false,
                    message: error.message,
                });
            });
    });
}


export function filter({status, month, year, sort, query}: FilterOrder):OrderResponse {
    return new Promise(async (resolve, reject) => {
        const db = await getDB();

        if (!db.data) {
            return reject({
                success: false,
                message: 'No orders found',
            });
        }

        const { ORDERS } = db.data;

        if (query !== '') {
            const orders = ORDERS.filter((order) => {
                return order.id.includes(query);
            });
            return resolve({
                success: true,
                data: orders,
            });
        }

        let filteredOrders = ORDERS;

        if (status !== 'all') {
            filteredOrders = filteredOrders.filter((order) => order.status.value === status);
        }

        if (month !== null) {
            filteredOrders = filteredOrders.filter((order) => {
                const date = new Date(order.status.lastUpdated);
                const lastUpdatedMonth = (date.getMonth() + 1).toString();
                const lastUpdatedYear = date.getFullYear().toString();

                const monthQuery = month.substring(0, month.indexOf('/'));
                const yearQuery = month.substring(month.indexOf('/') + 1);

                return lastUpdatedMonth === monthQuery && lastUpdatedYear === yearQuery;
            });
        }

        if (year !== null) {
            filteredOrders = filteredOrders.filter((order) => {
                const date = new Date(order.status.lastUpdated);
                return date.getFullYear().toString() === year;
            });
        }

        if (sort === 'oldest') {
            filteredOrders = filteredOrders.sort((a, b) => {
                const dateA = new Date(a.status.lastUpdated);
                const dateB = new Date(b.status.lastUpdated);

                return dateA.getTime() - dateB.getTime();
            });
        } else if (sort === 'newest') {
            filteredOrders = filteredOrders.sort((a, b) => {
                const dateA = new Date(a.status.lastUpdated);
                const dateB = new Date(b.status.lastUpdated);

                return dateB.getTime() - dateA.getTime();
            });
        }

        resolve({
            success: true,
            data: filteredOrders,
        });
    });
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
    return new Promise(async (resolve, reject) => {
        const db = await getDB();

        if (!db.data) {
            return reject({
                success: false,
                message: 'No orders found',
            });
        }

        const { ORDER_TEMPS } = db.data;

        ORDER_TEMPS.push(order);

        db.write()
            .then(() => db.read())
            .then(() => {
                if (!db.data)
                    return reject({
                    success: false,
                    message: "No orders found",
                    });
                
                                
                resolve({
                    success: true,
                    data: order,
                });
            });

    });
}

export function findTemp(id: string): TempOrderResponse {
    return new Promise(async (resolve, reject) => {
        const db = await getDB();

        if (!db.data) {
            return reject({
                success: false,
                message: 'No orders found',
            });
        }

        const { ORDER_TEMPS } = db.data;

        const order = ORDER_TEMPS.find((order) => order.id === id);

        if (!order) {
            return resolve({
                success: false,
                message: 'Order not found',
            });
        }

        resolve({
            success: true,
            data: order,
        });
    });
}

export function deleteTemp(id: string): TempOrderResponse {
    return new Promise(async (resolve, reject) => {
        const db = await getDB();

        if (!db.data) {
            return reject({
                success: false,
                message: 'No orders found',
            });
        }

        const { ORDER_TEMPS } = db.data;

        const order = ORDER_TEMPS.find((order) => order.id === id);

        if (!order) {
            return resolve({
                success: false,
                message: 'Order not found',
            });
        }

        const index = ORDER_TEMPS.indexOf(order);

        ORDER_TEMPS.splice(index, 1);

        db.write()
            .then(() => db.read())
            .then(() => {
                if (!db.data)
                    return reject({
                    success: false,
                    message: "No orders found",
                    });

                resolve({
                    success: true,
                    data: order,
                });
            });

    });
}
