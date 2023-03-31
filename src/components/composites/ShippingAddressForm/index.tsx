import styles from "@styles/composites/ShippingAddressForm.module.scss";
import { useEffect, useState } from "react";

import { ShippingAddress } from "@/types/others";

export interface Props {
    onChange?: (address: ShippingAddress) => void;
}


export default function ShippingAddressForm({ onChange}: Props) {

    const [name, setName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (onChange) {
            onChange({
                name,
                address1,
                address2,
                city,
                state,
                zip,
                phone,
                email,
            });
        }
    }, [name, address1, address2, city, state, zip, phone, email]);

    return (
        <form className={styles.wrapper}>
            <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => {setName(e.target.value)} }/>
            </div>
            <div className={styles.field}>
                <label htmlFor="address1">Address (Line 1)</label>
                <input type="text" id="address" value={address1} onChange={(e) => {setAddress1(e.target.value)}}/>
            </div>
            <div className={styles.field}>
                <label htmlFor="address2">Address (Line 2)</label>
                <input type="text" id="address2" value={address2} onChange={e => setAddress2(e.target.value)} />
            </div>
            <div className={styles.field}>
                <label htmlFor="city">City</label>
                <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)}/>
            </div>
            <div className={styles.field}>
                <label htmlFor="state">State</label>
                <input type="text" id="state" value={state} onChange={e => setState(e.target.value)}/>
            </div>
            <div className={styles.field}>
                <label htmlFor="zip">Zip</label>
                <input type="text" id="zip"  value={zip} onChange={e => setZip(e.target.value)}/>
            </div>
            <div className={styles.field}>
                <label htmlFor="phone">Phone Number</label>
                <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)}/>
            </div>
            <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
        </form>
    );
}

ShippingAddressForm.displayName = "ShippingAddressForm";