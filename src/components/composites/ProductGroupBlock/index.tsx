import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import styles from "@styles/composites/ProductBlock.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";
import { RemoteImage } from "@/types/image";

import type { Product } from "@/types/product";

import { useState, MouseEventHandler } from "react";
import { OrderedProduct } from "@/types/product";
import SelectCPN from "@/components/generics/Select";

export interface Props {
    id: string;
    name: string;
    price: number;
    images: RemoteImage[];
    products: Product[];
    addToCart: (orderedProduct: OrderedProduct) => void;
}


export default function ProductBlock({ id, name, price, images, products, addToCart}: Props) {

    const [quantity, setQuantity] = useState(0);

    const onAdd:MouseEventHandler<HTMLButtonElement>  = (e) => {
        e.preventDefault();

        addToCart({
            id,
            name,
            price,
            quantity,
            image: images[0],
        });

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
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.price}>
                    {price}
                </p>
                <SelectCPN
                    optionItems = {products}
                    onChange = {(selectedOption) => {console.log(selectedOption)}}
                    />
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