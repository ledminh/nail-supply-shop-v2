import styles from "@styles/composites/SortAndOrder.module.scss";

export interface Props {
}


export default function SortAndOrder({ }: Props) {


    return (
        <div className={styles.wrapper}>
            <div className={styles.field}>
                <label htmlFor="sort">Sort by</label>
                <select name="sort" id="sort">
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                </select>
            </div>
            <div className={styles.field}>
                <label htmlFor="order">Order</label>
                <select name="order" id="order">
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
        </div>
    );
}

SortAndOrder.displayName = "SortAndOrder";