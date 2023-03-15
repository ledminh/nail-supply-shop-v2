import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import styles from "@styles/composites/ProductBlock.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";
import { RemoteImage } from "@/types/image";

export interface Props {
    name: string;
    price: number;
    images: RemoteImage[];
}


export default function ProductBlock({ name, price, images}: Props) {


    return (
        <div className={styles.wrapper}>
            <ImageCPN
                image = {images[0]}
                size = "medium"
                className={styles.image}
            />
            <p className={styles.price}>
                {price}
            </p>
            <h3 className={styles.name}>{name}</h3>
            <div className={styles.controls}>
                <ButtonCPN
                    type="normal"
                    label="ADD TO CART"
                    className={styles.button}
                    />
                <QuantityPickerCPN/>
            </div>
        </div>    
    );
}

ProductBlock.displayName = "ProductBlock";