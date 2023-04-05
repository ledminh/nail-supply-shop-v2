
import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import styles from "@styles/composites/ProductBlock.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";
import { RemoteImage } from "@/types/image";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useCart  } from "@/contexts/CartContext";


export interface Props {
    id: string;
    name: string;
    price: number;
    images: RemoteImage[];
}


function ProductBlock({ id, name, price, images}: Props) {

    const [quantity, setQuantity] = useState(0);
    

    const { addToCart } = useCart();
    
    
    const onAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (quantity === 0) return;

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
        <div className={styles.wrapper + (quantity > 0? ' ' + styles.highLighted: '' )}>
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
                        disabled={quantity === 0}
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


export default memo(ProductBlock);


ProductBlock.displayName = "ProductBlock";
