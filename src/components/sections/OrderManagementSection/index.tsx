import OrderControl from "@/components/composites/OrderControl";
import OrderList from "@/components/composites/OrderList";
import styles from "@styles/sections/OrderManagementSection.module.scss";

import { useState } from "react";
import { Order, StatusValue } from "@/types/order";

type ControlProps = {
    status: StatusValue;
    month: string;
    year: string;
    sort: string;
    query: string;
};
    
export interface Props {
}



export default function OrderManagementSection({ }: Props) {

    const [orders, setOrders] = useState<Order[]>([]);

    const onControlChange = ({ status, month, year, sort, query}: ControlProps) => {
        
    };

    const onStatusChange = (id: string, status: StatusValue) => {
    };

    const onOrderDelete = (id: string) => {
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