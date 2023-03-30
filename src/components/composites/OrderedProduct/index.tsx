import ImageCPN from "@/components/basics/ImageCPN";
import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import {  OrderedProduct as OrderedProductType, ProductImage } from "@/types/product";
import styles from "@styles/composites/OrderedProduct.module.scss";

import removeIcon from "@images/cancel_icon.svg";
import { LocalImage } from "@/types/image";

import { useState, useEffect } from "react";




const sampleImg:ProductImage = {
    id: "1",
    src: "https://picsum.photos/200/300",
    alt: "sample image",
}

const removeIconImage:LocalImage = {
    src: removeIcon,
    alt: "cancel icon",
}

export interface Props extends OrderedProductType {
    onChange: ({id, quantity}: {id:string, quantity:number}) => void;
    onRemove: (id:string) => void;
}

export default function OrderedProduct({ id, name, price, quantity, image, onChange, onRemove }: Props) {

    const [totalPrice, setTotalPrice] = useState(price*quantity);


    useEffect(()=> {
        setTotalPrice(price*quantity);
    }, [quantity])

    return (
        <div className={styles.wrapper}>
            <QuantityPickerCPN
                value = {quantity}
                onChange = {(value) => {
                    onChange({id, quantity: value});
                }}
                buttonClassName = {styles.quantityButton}
                valueClassName = {styles.quantityValue}
                className = {styles.quantityPicker}
            />
            <ImageCPN
                image = {image}
                size = "medium"
                className = {styles.productImage}
            />
            <div className={styles.info}>
                <h3 className={styles.productName}>{name}</h3>
                <p className={styles.price}>{price}</p>
            </div>
            <div className={styles.totalPrice}>{totalPrice}</div>
            <button className={styles.removeButton}
                onClick = {() => onRemove(id)}
            >
                <ImageCPN
                    image = {removeIconImage}
                    size = "small"
                    className = {styles.removeIcon}
                    />
            </button>
        </div>
    );
}

OrderedProduct.displayName = "OrderedProduct";