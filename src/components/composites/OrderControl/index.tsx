import Select from "@/components/generics/Select";
import styles from "@styles/composites/OrderControl.module.scss";
import SearchBarCPN from "../SearchBar";

export interface Props {
}


export default function OrderControl({ }: Props) {


    return (
        <section className={styles.wrapper}>
            <section className={styles.filters}>
                <span className={styles.label}>
                    Filters
                </span>
                <Select
                    selectClass 
                    optionClass 
                    optionItems 
                    initOptionItem 
                    onChange
                    />
                <Select
                    selectClass 
                    optionClass 
                    optionItems 
                    initOptionItem 
                    onChange
                    />
                <Select
                    selectClass 
                    optionClass 
                    optionItems 
                    initOptionItem 
                    onChange
                    />
            </section>
            <section className={styles.searchBar}>
                <SearchBarCPN
                    onSearchSubmit
                    />
            </section>
            <section className={styles.sort}>
                <Select
                    selectClass 
                    optionClass 
                    optionItems 
                    initOptionItem 
                    onChange
                    />
            </section> 
        </section>
    );
}

OrderControl.displayName = "OrderControl";