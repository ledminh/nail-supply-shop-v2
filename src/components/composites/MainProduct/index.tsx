import ImageCPN from "@/components/basics/ImageCPN";
import styles from "@styles/composites/MainProduct.module.scss";
import Image from "next/image";

export interface Props {
    product: Product
}


export default function MainProduct({ product }: Props) {

    const { images, name, price, description } = product;

    return (
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
                <p className={styles.price}>
                    {price}
                </p>
                <p className={styles.description}>
                    {description}
                </p>
            </div>
        </div>      
    );
}

MainProduct.displayName = "MainProduct";