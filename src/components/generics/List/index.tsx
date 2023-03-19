import { FC } from "react";
import { Item } from "@/types/item";

import styles from "./List.module.scss";



/******************************
 *  Types and Interfaces
 */

export interface Props<T> {
    items: (T & Item)[];
    ItemCPN: FC<T>;
    liClass?: string;
    ulClass?: string;
    activeItem?: {
        id: string;
        className: string;
    },
    horizontal?: boolean;
};


export default function List<T>({
    items,
    ItemCPN,
    liClass,
    ulClass,
    activeItem,
    horizontal,
}: Props<T>) {

    if(horizontal) ulClass = `${ulClass} ${styles.horizontal}`.trim();

    

    return (
        <ul className={ulClass}>
            {
                items.map((item) => (
                    <li key={item.id} className={`${liClass} ${activeItem && activeItem.id === item.id? activeItem.className: ''.trim()}`}>
                        <ItemCPN {...item} />
                    </li>
                ))
            }
        </ul>
    );
}
