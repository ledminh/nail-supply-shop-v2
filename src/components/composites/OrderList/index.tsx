import styles from "@styles/composites/OrderList.module.scss";

import List from "@/components/generics/List";
import OrderBlock from "../OrderBlock";

import type { Order, StatusValue } from "@/types/order";

export interface Props {
    orders: Order[];
    onStatusChange: (id: string, status: StatusValue) => void;
    onOrderDelete: (id: string) => void;
}


export default function OrderList({ orders, onStatusChange, onOrderDelete }: Props) {

    const ItemCPN = getItemCPN({
        onStatusChange, 
        onOrderDelete
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.border}/>            
            <div className={styles.header}>
                <div className={styles.orderNumber}>Order #</div>
                <div className={styles.lastUpdated}>Last Updated</div>
                <div className={styles.products}>Products</div>
                <div className={styles.shippingAddress}>Shipping Address</div>
                <div className={styles.price}>Total</div>
                <div className={styles.status}>Status</div>
                <div className={styles.delete}/>
            </div>
            <List 
                items = {orders.map((order) => ({id: order.id, item: order}))} 
                ItemCPN = {ItemCPN}
                liClass = {styles.li}
                ulClass = {styles.ul}
                />
            <div className={styles.border}/>
            <div className={styles.total}>
                <span className={styles.label}>Total</span>
                <span className={styles.value}>$0.00</span>
            </div>
        </div>


    );
}

OrderList.displayName = "OrderList";

type getItemCPNPropsType = {
    
    onStatusChange: (id: string, status: StatusValue) => void;
    onOrderDelete: (id: string) => void;
}

const getItemCPN = ({onStatusChange, onOrderDelete }:getItemCPNPropsType) => {
  
    const ItemCPN = ({item}: {item:Order}) => (
        <OrderBlock order={item} onStatusChange={onStatusChange} onOrderDelete={onOrderDelete}/>
    )


    return ItemCPN;
}