import { Order } from "@/types/order";
import styles from "@styles/composites/OrderBlock.module.scss";

import StatusSelectCPN from "@/components/basics/StatusSelect";

import ButtonCPN from "@components/basics/ButtonCPN";

export interface Props {
    order: Order
}


export default function OrderBlock({ order }: Props) {


    return (
        <div className={styles.wrapper}>
            <div className={styles.orderNumber}>
                <span>{order.id}</span>
            </div>
            <div className={styles.lastUpdated}>
                <span>{order.status.lastUpdated}</span>
            </div>
            <div className={styles.products}>
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
            <div className={styles.shippingAddress}>
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
            <div className={styles.price}>
                <span>
                    {
                        "$" + order.orderedProducts.reduce((acc, product) => {
                            return acc + (product.price * product.quantity);
                        }, 0)
                    }
                </span>
            </div>
            <div className={styles.status}>
                <StatusSelectCPN onSave={() => {}} />
            </div>
            <div className={styles.deleteButton}>
                <ButtonCPN
                    type="danger"
                    label="Delete"
                    onClick={() => { }}
                    className={styles.deleteButton}
                    />
            </div>
        </div>
    );
}

OrderBlock.displayName = "OrderBlock";