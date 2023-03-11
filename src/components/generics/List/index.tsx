import { FC } from "react";
import { Item } from "@/types";

import styles from "./List.module.scss";



/******************************
 *  Types and Interfaces
 */

export interface Props<T extends JSX.IntrinsicAttributes & Item> {
    items: T[];
    ItemCPN: FC<T>;
    liClass?: string;
    ulClass?: string;
    horizontal?: boolean;
};


export default function List<T extends JSX.IntrinsicAttributes & Item>({
    items,
    ItemCPN,
    liClass,
    ulClass,
    horizontal,
}: Props<T>) {

    if(horizontal) ulClass = `${ulClass} ${styles.horizontal}`.trim();

    return (
        <ul className={ulClass}>
        {items.map((item) => (
            <li key={item.id} className={liClass}>
            <ItemCPN {...item} />
            </li>
        ))}
        </ul>
    );
}
