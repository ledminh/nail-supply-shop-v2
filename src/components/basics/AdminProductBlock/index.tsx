import { FC } from "react";
import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";


import styles from "@styles/basics/AdminProductBlockCPN.module.scss";
import { Product } from "@/types/product";



export interface Props extends Product {
    
    onDelete: (productID: string) => void,
    onClick: ({productID}: {productID:string}) => void,
    className?: string,
};

type AdminCategoryBlock = FC<Props>;


const AdminProductBlockCPN:AdminCategoryBlock = ({id, images, name, price, intro, onDelete, onClick, className}) => {

    const classNames = [styles.wrapper, className].join(" ");

    return (
        <div className={classNames}
            onClick = {(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick({productID: id});
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

export default AdminProductBlockCPN;

AdminProductBlockCPN.displayName = "AdminProductBlockCPN";