import AdminCategoryBlockCPN from "@/components/basics/AdminCategoryBlock";
import List from "@/components/generics/List";
import styles from "@styles/sections/CategoryManagementSection.module.scss";

import { RemoteImage } from "@/types/image";
import { Category } from "@/types/category";

import { useState, useEffect } from "react";

export interface Props {
}


export default function CategoryManagementSection({  }: Props) {

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    const onDelete = (catID: string) => {
        console.log('delete', catID);
    }

    const onClick = (catID: string) => {
        console.log('click', catID);
    }

    const onAdd = (catID: string) => {
        console.log('add', catID);
    }
    


    return (
        <section className={styles.wrapper}>
            <List 
                items = {[{id: 'add-button', onAdd},...categories.map((cat) => ({
                    ...cat,
                    onDelete,
                    onClick
                }))]}
                ItemCPN = {ItemCPN}
                liClass = {styles.li}
                ulClass = {styles.ul}
            />
        </section>
    );
}

CategoryManagementSection.displayName = "CategoryManagementSection";



interface ItemCPNProps  {
    id: string,
    image?: RemoteImage,
    name?: string,
    description?: string,
    onDelete?: (catID: string) => void,
    onClick?: (catID: string) => void
    onAdd?: (catID: string) => void
};
const ItemCPN = ({id, image, name, description, onDelete, onClick, onAdd}:ItemCPNProps) => {

    return (
        <>
            {
                (image && name && description && onDelete && onClick) && (
                    <AdminCategoryBlockCPN
                            id = {id}
                            image = {image}
                            name = {name}
                            description = {description}
                            onDelete = {onDelete}
                            onClick = {onClick}
                        />)
            }
            {
                onAdd && (
                    <button className={styles.addButon}
                        onClick = {(e) => {
                            e.preventDefault();
                            onAdd(id);
                        }}
                        >
                        ADD
                    </button>
                )
            }
        </>
    );
}