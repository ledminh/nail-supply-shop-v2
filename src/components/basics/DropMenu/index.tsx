import { FC, useEffect, useState} from "react";

import styles from "@styles/basics/DropMenuCPN.module.scss";
import List from "@/components/generics/List";

import  ImageCPN  from "@/components/basics/ImageCPN";
import trianglePNG from "@images/triangle.png";


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
    headerClass?: string;
    toggleIconClass?: string;
    onChange?: (id: string) => void;
};


type DropMenu = FC<Props>;


const DropMenuCPN:DropMenu = ({items, liClass, ulClass, activeLiClass, itemClass, headerClass,toggleIconClass, onChange}) => {
    const [currentItem, setCurrentItem] = useState(items[0]);

    const [isOpenedList, setIsOpenedList] = useState(false);

    const itemOnClick = (id: string) => {
        setCurrentItem(items.find(item => item.id === id) as ItemCPNProps);

        setIsOpenedList(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentItem]);

    useEffect(() => {
        if(isOpenedList) {
            const onClick = () => {
                setIsOpenedList(false);
            }
            document.addEventListener("click", onClick);
            return () => {
                document.removeEventListener("click", onClick);
            }
        }
    }, [isOpenedList]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header + (headerClass? ' ' + headerClass: "")}
                onClick={e => {
                    e.stopPropagation();
                    setIsOpenedList(!isOpenedList);
                }}
            >
                <span>{currentItem.label}</span>
                <ImageCPN
                    image={{
                        src: trianglePNG,
                        alt: "toggle-icon",
                    }}
                    className={styles.toggleIcon + (toggleIconClass? ' ' + toggleIconClass: '') + (isOpenedList? ' ' + styles.isOpened: '')}
                    size="small"
                    />
            </div>
            <div className={styles.body + (isOpenedList? ' ' + styles.isOpened: '')}>
                <List 
                    items = {items}
                    ItemCPN = {ItemCPN}
                    liClass = {styles.li + ' ' + (liClass? liClass: '')}
                    ulClass = {styles.ul + ' ' + (ulClass? ulClass : '')}
                    activeItem = {{
                        id: currentItem.id,
                        className: styles.active + (activeLiClass? ' ' + activeLiClass: ''),
                    }}
                />
            </div>
        </div>
    );
}

export default DropMenuCPN;

DropMenuCPN.displayName = "DropMenuCPN";

