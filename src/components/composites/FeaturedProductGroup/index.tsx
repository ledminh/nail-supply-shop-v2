import styles from "@styles/composites/FeaturedProductGroup.module.scss";
import MainProduct from "@components/composites/MainProduct";
import ProductList from "@components/composites/ProductList";

import type { Product } from "@/types/product";
import SeparatorCPN from "@/components/basics/SeparatorCPN";

export interface Props {
    title: string;
    mainProduct: Product;
    otherProducts: Product[];
}


export default function FeaturedProductGroup({title, mainProduct, otherProducts }: Props) {


    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.mainProduct}>
                <MainProduct 
                    product={mainProduct}
                />
            </div>
            <div className={styles.otherProducts}>
                <h4 className={styles.title}>Others</h4>
                <SeparatorCPN/>
                <div className={styles.productList}>
                    <ProductList 
                        products={otherProducts}
                        type='list'
                    />
                </div>
            </div>
        </div>
    );
}

FeaturedProductGroup.displayName = "FeaturedProductGroup";