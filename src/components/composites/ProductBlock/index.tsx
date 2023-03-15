import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import styles from "@styles/composites/ProductBlock.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";
import { RemoteImage } from "@/types/image";

import { useState, MouseEventHandler } from "react";

export interface Props {
    name: string;
    price: number;
    images: RemoteImage[];
}


export default function ProductBlock({ name, price, images}: Props) {

    const [quantity, setQuantity] = useState(0);

    const onAdd:MouseEventHandler<HTMLButtonElement>  = (e) => {
        e.preventDefault();
        setQuantity(0);

    };


    return (
        <div className={styles.wrapper + (quantity> 0? ' ' + styles.highLighted: '' )}>
            <ImageCPN
                image = {images[0]}
                size = "medium"
                className={styles.image}
            />
 
            <div className={styles.text}>
                <p className={styles.price}>
                    {price}
                </p>
                <h3 className={styles.name}>{name}</h3>
                <div className={styles.controls}>
                    <ButtonCPN
                        type="normal"
                        label="ADD TO CART"
                        className={styles.button}
                        onClick={onAdd}
                        />
                    <QuantityPickerCPN
                        value={quantity}
                        onChange ={(q) => setQuantity(q)}
                        buttonClassName = {styles.quantityButton}
                        valueClassName = {styles.quantityValue}
                        className = {styles.quantityPicker}
                    />
                </div>
            </div>
        </div>    
    );
}

ProductBlock.displayName = "ProductBlock";