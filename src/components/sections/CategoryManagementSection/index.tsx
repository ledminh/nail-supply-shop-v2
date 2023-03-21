import AdminCategoryBlockCPN from "@/components/basics/AdminCategoryBlock";
import List from "@/components/generics/List";
import styles from "@styles/sections/CategoryManagementSection.module.scss";

import { RemoteImage } from "@/types/image";
import { Category } from "@/types/category";

import { useState, useEffect } from "react";

import CategoryModal from "@/components/composites/CategoryModal";
import WarningModal from "@/components/composites/WarningModal";
import { categoryManagementConfig } from "@/config";

export interface Props {
}


export default function CategoryManagementSection({  }: Props) {

    const [categories, setCategories] = useState<Category[]>([]);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

    const [toBeDeletedCategoryID, setToBeDeletedCategoryID] = useState<string | null>(null);

    const getCategoryName = (catID: string) => {
        const cat = categories.find((cat) => cat.id === catID);
        return cat ? cat.name : '';
    }

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

    /********************************
     * Functions for CategoryModal
     */
    const onDelete = (catID: string) => {
        setToBeDeletedCategoryID(catID);
        setIsWarningModalOpen(true);
    }

    const onClick = (catID: string) => {
        console.log('click', catID);
    }

    const onAdd = (catID: string) => {
        console.log('add', catID);
    }

    const deleteCategory = (catID: string) => {
        console.log('delete', catID);
        fetch(`/api/categories/?type=delete&id=${catID}`, {
            method: 'POST'
        })
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }


    


    return (
        <>
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
            {
                isCategoryModalOpen && (
                    <CategoryModal type="create" 
                        onSave={(e) => console.log(e)} 
                        onCancel={() => console.log('cancel')}
                        />)
            }
            {
                isWarningModalOpen && (
                    <WarningModal message={categoryManagementConfig.warningMessage(getCategoryName(toBeDeletedCategoryID!))}
                        onOK={() => {
                            deleteCategory(toBeDeletedCategoryID!);
                            setIsWarningModalOpen(false);
                        }} 
                        onCancel={() => {
                            setToBeDeletedCategoryID(null);
                            setIsWarningModalOpen(false);
                        }}
                        />)
            }
        </>
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
                            className={styles.categoryBlock}
                        />)
            }
            {
                onAdd && (
                    <button className={styles.addButton}
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