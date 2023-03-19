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
    onClick: (catID: string) => void
};

type AdminCategoryBlock = FC<Props>;


const AdminCategoryBlockCPN:AdminCategoryBlock = ({id, image, name, description, onDelete, onClick}) => {


    return (
        <button className={styles.wrapper}
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
        </button>
    );
}

export default AdminCategoryBlockCPN;

AdminCategoryBlockCPN.displayName = "AdminCategoryBlockCPN";