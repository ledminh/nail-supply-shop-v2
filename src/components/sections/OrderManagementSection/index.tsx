import OrderControl from "@/components/composites/OrderControl";
import OrderList from "@/components/composites/OrderList";
import styles from "@styles/sections/OrderManagementSection.module.scss";

import { useState, useEffect } from "react";
import { Order, StatusValue } from "@/types/order";

import axios from "axios";

import { FilterOrder } from "@/types/order";



type ControlProps = FilterOrder
    
export interface Props {
}



export default function OrderManagementSection({ }: Props) {

    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        axios.get('/api/orders')
            .then(({data}) => {
                if(data.success)
                    setOrders(data.orders);
                else {
                    throw new Error(data.message);
                }
            })
            .catch(err => {
                throw err;
            });
    }, []);


    const onControlChange = ({ status, month, year, sort, query}: ControlProps) => {
        
        axios.post(`/api/orders/?type=filter`, {
            status,
            month,
            year,
            sort,
            query,
            })
            .then(({data}) => {
                if(data.success) {
                    setOrders(data.orders);
                }
                else {
                    throw new Error(data.message);
                }
            });
    };

    const onStatusChange = (id: string, status: StatusValue) => {
        axios.post(`/api/orders/?type=status&id=${id}&status=${status}`)
            .then(({data}) => {
                if(data.success) {
                    const updatedOrder = data.orders[0];
                    console.log(updatedOrder);
                    setOrders(orders.map(order => {
                        if(order.id === updatedOrder.id) {
                            return updatedOrder;
                        }
                        return order;
                    }));
                }
                else {
                    throw new Error(data.message);
                }
                })
            .catch(err => {
                throw err;
            });
        
    };

    const onOrderDelete = (id: string) => {

        axios.post(`/api/orders/?type=delete&id=${id}`)
            .then(({data}) => {
                if(data.success) {
                    setOrders(orders.filter(order => order.id !== id));
                }
                else {
                    throw new Error(data.message);
                }
            });
    };

    return (
        <section className={styles.wrapper}>
            <OrderControl
                onChange={onControlChange}
            />
            <OrderList
                orders = {orders} 
                onStatusChange = {onStatusChange}
                onOrderDelete = {onOrderDelete}
            />
        </section>
    );
}

OrderManagementSection.displayName = "OrderManagementSection";


const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return {
        month,
        year,
    };
}