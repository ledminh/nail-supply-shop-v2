import { FC, MouseEventHandler, useState} from "react";

import styles from "@styles/basics/DropMenuCPN.module.scss";
import List from "@/components/generics/List";




export interface Props  {

};

type DropMenu = FC<Props>;


const DropMenuCPN:DropMenu = ({}) => {
    const [currentItemID, setCurrentItemID] = useState("Item 1");

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}></div>
            <div className={styles.body}>
                <List 
                    items 
                    ItemCPN = {ItemCPN}
                    liClass = {styles.li}
                    ulClass = {styles.ul}
                    activeItem = {{
                        id: "Item 1",
                        className: styles.activeItem,
                    }}
                />
            </div>
        </div>
    );
}

export default DropMenuCPN;

DropMenuCPN.displayName = "DropMenuCPN";

type ItemCPNProps = {
    onClick: MouseEventHandler<HTMLButtonElement>;
    label: string;
}

const ItemCPN = ({onClick, label}:ItemCPNProps) => {
    return (
        <button className={styles.item}
            onClick={onClick}
        >
            {label}
        </button>
    );
}