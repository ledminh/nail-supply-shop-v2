import styles from "@styles/sections/FeaturedProductsSection.module.scss";

export interface Props {
}


export default function FeaturedProductsSection({ }: Props) {


    return (
        <section className={styles.placeholder}>
            FeaturedProducts Section
        </section>
    );
}

FeaturedProductsSection.displayName = "FeaturedProductsSection";