import { FC } from "react";
import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";

import { RemoteImage } from "@/types/image";

import styles from "@styles/basics/AdminCategoryBlockCPN.module.scss";



export interface Props  {
    id: string,
    image: RemoteImage,
    name: string,
    description: string,
    onDelete: (catID: string) => void,
    onClick: (catID: string) => void,
    className?: string,
};

type AdminCategoryBlock = FC<Props>;


const AdminCategoryBlockCPN:AdminCategoryBlock = ({id, image, name, description, onDelete, onClick, className}) => {

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
                image = {image}
                size = "medium"
                className = {styles.image}
            />
            <div className={styles.text}>
                <h3 className={styles.name}>{name}</h3>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.description}>{description}</p>
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

export default AdminCategoryBlockCPN;

AdminCategoryBlockCPN.displayName = "AdminCategoryBlockCPN";