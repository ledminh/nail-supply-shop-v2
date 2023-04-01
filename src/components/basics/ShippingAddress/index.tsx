import { FC } from "react";

import { ShippingAddress as ShippingAddressType } from "@/types/others";


import styles from "@styles/basics/ShippingAddressCPN.module.scss";



export interface Props  {
    shippingAddress: ShippingAddressType;
};

type ShippingAddress = FC<Props>;


const ShippingAddressCPN:ShippingAddress = ({shippingAddress}) => {



    return (
        <div className={styles.wrapper}>
            {
                Object.keys(shippingAddress).map((key, index) => {
                    const _key = key as keyof ShippingAddressType;
                    const _value = shippingAddress[_key];

                    if (!_value) return;

                    return (
                        <div key={key} className={styles.item}>
                            <span className={styles.label}>{key}: </span>
                            <span className={styles.value}>{shippingAddress[key as keyof ShippingAddressType]}</span>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default ShippingAddressCPN;

ShippingAddressCPN.displayName = "ShippingAddressCPN";