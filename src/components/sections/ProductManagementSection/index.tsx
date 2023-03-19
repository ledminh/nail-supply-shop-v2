import styles from "@styles/sections/ProductManagementSection.module.scss";

export interface Props {
}


export default function ProductManagementSection({ }: Props) {


    return (
        <section className={styles.placeholder}>
            ProductManagement Section
        </section>
    );
}

ProductManagementSection.displayName = "ProductManagementSection";