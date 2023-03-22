import { FC } from "react";
import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";

import { RemoteImage } from "@/types/image";

import styles from "@styles/basics/AdminProductGroupBlockCPN.module.scss";



export interface Props  {
    id: string,
    images: RemoteImage[],
    name: string,
    price: number,
    intro: string,
    onDelete: (productID: string) => void,
    onClick: (productID: string) => void,
    className?: string,
};

type AdminProductGroupBlock = FC<Props>;


const AdminProductGroupBlockCPN:AdminProductGroupBlock = ({id, images, name, price, intro, onDelete, onClick, className}) => {

    const classNames = [styles.wrapper, className].join(" ");

    return (
        <div className={classNames}
            onClick = {(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(id);
            }}
        >
            <ImageCPN
                image = {images[0]}
                size = "medium"
                className = {styles.image}
            />
            <div className={styles.text}>
                <h3 className={styles.price}>{price}</h3>
                <h4 className={styles.price}>{price}</h4>
                <h3 className={styles.name}>{name}</h3>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.description}>{intro}</p>
            </div>
            <ButtonCPN
                type = "danger"
                onClick = {(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    onDelete(id);
                }}
                label = "Delete"
                className = {styles.deleteButton}
            />
        </div>
    );
}

export default AdminProductGroupBlockCPN;

AdminProductGroupBlockCPN.displayName = "AdminProductGroupBlockCPN";