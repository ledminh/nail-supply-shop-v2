import { Order, StatusValue } from "@/types/order";
import styles from "@styles/composites/OrderBlock.module.scss";

import StatusSelectCPN from "@/components/basics/StatusSelect";

import ButtonCPN from "@components/basics/ButtonCPN";

export interface Props {
    order: Order,
    onStatusChange: (id: string, status: StatusValue) => void,
    onOrderDelete: (id: string) => void
}


export default function OrderBlock({ order, onStatusChange, onOrderDelete }: Props) {


    return (
        <div className={styles.wrapper}>
            <div className={styles.field + ' ' + styles.orderNumber}>
                <span className={styles.label}>Order #</span>
                <span className={styles.value}>{order.id}</span>
            </div>
            <div className={styles.field + ' ' + styles.lastUpdated}>
                <span className={styles.label}>Last Updated</span>
                <span className={styles.value}>{new Date(order.status.lastUpdated).toDateString()}</span>
            </div>
            <div className={styles.field + ' ' + styles.products}>
                <div className={styles.label}>Products</div>
                <div className={styles.value}>
                    {
                        order.orderedProducts.map((product) => {
                            return (
                                <span className={styles.product} key={product.id}>
                                    {`${product.name}${product.quantity > 1 ? ` (x${product.quantity})` : ''}`}
                                </span>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.field + ' ' + styles.shippingAddress}>
                <div className={styles.label}>Shipping Address</div>
                <div className={styles.value}>
                    {
                        Object.entries(order.shippingAddress).map(([key, value]) => {
                            return (
                                <span key={key}>
                                    {value}
                                </span>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.field + ' ' + styles.price}>
                <span className={styles.label}>Total</span>
                <span className={styles.value}>
                    {
                        "$" + order.orderedProducts.reduce((acc, product) => {
                            return acc + (product.price * product.quantity);
                        }, 0)
                    }
                </span>
            </div>
            <div className={styles.field + ' ' + styles.status}>
                <div className={styles.label}>Status</div>
                <div className={styles.value}>
                    <StatusSelectCPN onSave={(status) => {
                        onStatusChange(order.id, status);
                    }} />
                </div>
            </div>
            <div className={styles.field + ' ' + styles.deleteButton}>
                <ButtonCPN
                    type="danger"
                    label="Delete"
                    onClick={() => { 
                        onOrderDelete(order.id);
                    }}
                    className={styles.deleteButton}
                    />
            </div>
        </div>
    );
}

OrderBlock.displayName = "OrderBlock";