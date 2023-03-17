import styles from "@styles/composites/SortAndOrder.module.scss";

import SelectCPN from "@/components/generics/Select";
import { ListCondition, SortItem, SortedOrderItem } from "@/types/list-conditions";

import { useState, useEffect } from "react";

export interface Props {
    sortItems: SortItem[];
    sortedOrderItems: SortedOrderItem[];
    initCondition: ListCondition;
    onChange: (condition: ListCondition) => void;
}


export default function SortAndOrder({ sortItems, sortedOrderItems, initCondition, onChange }: Props) {

    const [condition, setCondition] = useState<ListCondition>(initCondition);

    useEffect(() => {
        if(condition !== initCondition)
            onChange(condition);

    }, [condition]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.field}>
                <label htmlFor="sort">SORT BY</label>
                <SelectCPN
                    optionItems={sortItems}
                    selectClass={styles.select}
                    initOptionItem={initCondition.sort}
                    onChange={(sortItem) => { 
                        setCondition({
                            ...condition,
                            sort: sortItem as SortItem
                            });
                        }}
                />
                        

            </div>
            <div className={styles.field}>
                <label htmlFor="order">ORDER</label>
                <SelectCPN
                    optionItems={sortedOrderItems}
                    selectClass={styles.select}
                    initOptionItem={initCondition.sortedOrder}
                    onChange={(sortedOrderItem) => { 
                        setCondition({
                            ...condition,
                            sortedOrder: sortedOrderItem as SortedOrderItem
                            });
                        }}
                />
            </div>
        </div>
    );
}

SortAndOrder.displayName = "SortAndOrder";