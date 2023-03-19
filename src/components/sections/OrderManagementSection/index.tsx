import styles from "@styles/sections/OrderManagementSection.module.scss";

export interface Props {
}


export default function OrderManagementSection({ }: Props) {


    return (
        <section className={styles.placeholder}>
            OrderManagement Section
        </section>
    );
}

OrderManagementSection.displayName = "OrderManagementSection";