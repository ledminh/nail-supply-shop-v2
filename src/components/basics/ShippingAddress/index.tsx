import { FC } from "react";

import { ShippingAddress as ShippingAddressType } from "@/types/order";


import styles from "@styles/basics/ShippingAddressCPN.module.scss";



export interface Props  {
    shippingAddress: ShippingAddressType;
};

type ShippingAddress = FC<Props>;


const ShippingAddressCPN:ShippingAddress = ({shippingAddress}) => {



    return (
        <div className={styles.wrapper}>
            {
                Object.keys(shippingAddress).map((key) => {
                    let _key:string = key;
                    const _value = shippingAddress[key as keyof ShippingAddressType];

                    if(_key === 'address2')
                        _key = '';

                    if (!_value) return;

                    return (
                        <div key={key} className={styles.item}>
                            <span className={styles.label}>{`${_key === ''? '': _key + ':'}`}</span>
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