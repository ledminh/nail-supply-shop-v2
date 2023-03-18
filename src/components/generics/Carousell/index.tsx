import { FC, useState } from "react";

import styles from '@styles/generics/Carousell.module.scss';
import { Item } from "@/types/item";


export interface Props<T> {
    items: (T & Item)[];
    initialItemID: string;
    ItemCPN: FC<T>;
    className?: string;
    mainItemClassName?: string;
    ulClassName?: string;
    liClassName?: string;
};

export default function Carousell<T>({
    items, initialItemID, ItemCPN, className, mainItemClassName, ulClassName, liClassName
}: Props<T>) {

    const [mainItem, setMainItem] = useState(items.find((item) => item.id === initialItemID)?? items[0]);
    const [otherItems, setOtherItems] = useState(items.filter((item) => item.id !== mainItem.id));

    const classNames = [styles.wrapper, className].join(' ');
    const mainItemClassNames = [styles.mainItem, mainItemClassName].join(' ');
    const ulClassNames = [styles.otherItems, ulClassName].join(' ');
    const liClassNames = [styles.otherItem, liClassName].join(' ');

    const otherItemOnClick = (id:string) => {
        const newMainItem = items.find((item) => item.id === id);
        if(newMainItem) {
            setMainItem(newMainItem);
            setOtherItems(items.filter((item) => item.id !== newMainItem.id));
        }
    }

    return (
        <div className={classNames}>
            <div className = {mainItemClassNames}>
                <ItemCPN {...mainItem} />
            </div>
            <ul className = {ulClassNames}>
                {
                    otherItems.map((item) => (
                        <li key={item.id} 
                            className={liClassNames}
                            onClick={() => otherItemOnClick(item.id)}
                            >
                            <ItemCPN {...item} />
                        </li>
                        )) 
                }
            </ul>
        </div>
    );
}