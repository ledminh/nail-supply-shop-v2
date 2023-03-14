import { FC, useEffect, useState} from "react";

import styles from "@styles/basics/DropMenuCPN.module.scss";
import List from "@/components/generics/List";


type ItemCPNProps = {
    id: string;
    label: string;
}

export interface Props  {
    items: (ItemCPNProps & {id: string})[];
    liClass?: string;
    ulClass?: string;
    activeLiClass?: string;
    itemClass?: string;
    onChange?: (id: string) => void;
};


type DropMenu = FC<Props>;


const DropMenuCPN:DropMenu = ({items, liClass, ulClass, activeLiClass, itemClass, onChange}) => {
    const [currentItem, setCurrentItem] = useState(items[0]);

    const itemOnClick = (id: string) => {
        setCurrentItem(items.find(item => item.id === id) as ItemCPNProps);
    }

        
    const ItemCPN = ({id, label}:ItemCPNProps) => {
        return (
            <div className={styles.item + (itemClass? ' ' + itemClass: '')}
                onClick={e => {
                    e.stopPropagation();
                    itemOnClick(id);
                }}
                >
                {label}
            </div>
        );
    }


    useEffect(() => {
        onChange && onChange(currentItem.id);
    }, [currentItem.id]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span>{currentItem.label}</span>
                    
            </div>
            <div className={styles.body}>
                <List 
                    items = {items}
                    ItemCPN = {ItemCPN}
                    liClass = {styles.li + ' ' + (liClass? liClass: '')}
                    ulClass = {styles.ul + ' ' + (ulClass? ulClass : '')}
                    activeItem = {activeLiClass? {
                        id: currentItem.id,
                        className: activeLiClass ,
                    }: undefined}
                />
            </div>
        </div>
    );
}

export default DropMenuCPN;

DropMenuCPN.displayName = "DropMenuCPN";

