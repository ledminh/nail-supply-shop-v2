import ImageCPN from "@/components/basics/ImageCPN";
import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import { ProductImage } from "@/types/product";
import styles from "@styles/composites/OrderedProduct.module.scss";

import removeIcon from "@images/cancel_icon.svg";
import { LocalImage } from "@/types/image";

export interface Props {
}


const sampleImg:ProductImage = {
    id: "1",
    src: "https://picsum.photos/200/300",
    alt: "sample image",
}

const removeIconImage:LocalImage = {
    src: removeIcon,
    alt: "cancel icon",
}

export default function OrderedProduct({ }: Props) {


    return (
        <div className={styles.wrapper}>
            <QuantityPickerCPN
                value = {2}
                onChange = {() => {}}
                buttonClassName = {styles.quantityButton}
                valueClassName = {styles.quantityValue}
                className = {styles.quantityPicker}
            />
            <ImageCPN
                image = {sampleImg}
                size = "medium"
                className = {styles.productImage}
            />
            <div className={styles.info}>
                <h3 className={styles.productName}>Product Name</h3>
                <p className={styles.price}>100</p>
            </div>
            <div className={styles.totalPrice}>300</div>
            <button className={styles.removeButton}>
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