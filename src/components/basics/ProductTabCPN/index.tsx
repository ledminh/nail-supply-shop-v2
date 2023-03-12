import { FC } from "react";



import styles from "@styles/basics/ProductTabCPN.module.scss";
import type { Product } from '@/types/product';
import  ImageCPN  from '@/components/basics/ImageCPN';



export interface Props extends Product  {
    detailed?: boolean;
};

type ProductTab = FC<Props>;


const ProductTabCPN:ProductTab = ({name, intro, images, price, detailed}) => {

    if(!detailed) {
        return (
            <div className={styles.wrapper}>
                <span>{name}</span>
            </div>
        );
    }
    let _intro = intro;

    if(intro.length > 80) {
        _intro = intro.slice(0, 80) + "...";
    }

    return (
        <div className={styles.wrapper + ' ' + styles.detailed}>
             <ImageCPN
                image={images[0]}
                size="small"
                className={styles.image + ' ' + styles.detailed}
                />
            <div className={styles.text + ' ' + styles.detailed}>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.price}>{price}</p>
                <p className={styles.intro}>{_intro}</p>
            </div>
        </div>
    )

}

export default ProductTabCPN;

ProductTabCPN.displayName = "ProductTabCPN";