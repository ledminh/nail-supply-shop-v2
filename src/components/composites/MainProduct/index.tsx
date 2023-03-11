import ImageCPN from "@/components/basics/ImageCPN";
import styles from "@styles/composites/MainProduct.module.scss";

import type { Product } from "@/types/product";
import Link from "next/link";


export interface Props {
    product: Product
}


export default function MainProduct({ product }: Props) {

    let { images, name, price, intro } = product;

    if(intro.length > 60) {
        intro = intro.slice(0, 60) + "...";
    }

    return (
        <Link href={`/products/${product.id}`}>
            <div className={styles.wrapper}>
                <ImageCPN
                    image={images[0]}
                    sizes="(max-width: 700px) 70vw, 900px"
                    className={styles.image}
                />
                <div className={styles.text}>
                    <h3 className={styles.name}>
                        {name}
                    </h3>
                    <h4 className={styles.price}>
                        {price}
                    </h4>
                    <p className={styles.intro}>
                        <small>{intro}</small>
                    </p>
                </div>
            </div>
        </Link>      
    );
}

MainProduct.displayName = "MainProduct";