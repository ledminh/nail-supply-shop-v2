import { FC } from "react";



import styles from "@styles/basics/ShippingAddressCPN.module.scss";



export interface Props  {

};

type ShippingAddress = FC<Props>;


const ShippingAddressCPN:ShippingAddress = ({}) => {


    return (
        <div className={styles.address}>
            <span className={styles.label}>Name: </span>
            <span className={styles.value}>John Doe</span>
            <span className={styles.label}>Address: </span>
            <span className={styles.value}>123 Main Street</span>
            <span className={styles.label}>City: </span>
            <span className={styles.value}>New York</span>
            <span className={styles.label}>State: </span>
            <span className={styles.value}>NY</span>
            <span className={styles.label}>Zip: </span>
            <span className={styles.value}>10001</span>
        </div>
    );
}

export default ShippingAddressCPN;

ShippingAddressCPN.displayName = "ShippingAddressCPN";