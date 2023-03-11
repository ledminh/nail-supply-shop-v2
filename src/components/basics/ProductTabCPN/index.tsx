import { FC } from "react";



import styles from "@styles/basics/ProductTabCPN.module.scss";
import type { Product } from '@/types/product';
import  ImageCPN  from '@/components/basics/ImageCPN';



export interface Props  {
    product: Product;
    detailed?: boolean;
};

type ProductTab = FC<Props>;


const ProductTabCPN:ProductTab = ({product, detailed}) => {

    if(!detailed) {
        return (
            <div className={styles.wrapper}>
                <span>{product.name}</span>
            </div>
        );
    }
    let intro = product.intro;

    if(product.intro.length > 80) {
        intro = product.intro.slice(0, 80) + "...";
    }

    return (
        <div className={styles.wrapper + ' ' + styles.detailed}>
             <ImageCPN
                image={product.images[0]}
                size="small"
                className={styles.image + ' ' + styles.detailed}
                />
            <div className={styles.text + ' ' + styles.detailed}>
                <h4 className={styles.name}>{product.name}</h4>
                <p className={styles.price}>{product.price}</p>
                <p className={styles.intro}>{intro}</p>
            </div>
        </div>
    )

}

export default ProductTabCPN;

ProductTabCPN.displayName = "ProductTabCPN";