import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import axios from "axios";

import { useWarningModal } from "@/components/composites/WarningModal";

import { useState, useEffect } from "react";
import AdminProductBlockCPN from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN from "@/components/basics/AdminProductGroupBlock";
import { useProductModal } from "@/components/composites/ProductModal";


import useDelete from "@/hooks/ProductManagementSection/useDelete";
import { useGroupModal } from "@/components/composites/ProductGroupModal";
import useEdit from "@/hooks/ProductManagementSection/useEdit";

import isProduct from "@/utils/isProduct";
import Select from "@/components/generics/Select";
import ButtonCPN from "@/components/basics/ButtonCPN";
import { Category } from "@/types/category";


import useCreate from "@/hooks/ProductManagementSection/useCreate";

import { OptionItem, convertToOptionItem } from "@/components/generics/Select";

export interface Props {
}



export default function ProductManagementSection({  }: Props) {
    

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category|null>(null);

    const {showWarning,  WarningModalComponent} = useWarningModal();
    const {openEditProduct, openCreateProduct, ProductModalComponent} = useProductModal();
    const {openEditGroup, openCreateGroup, GroupModalComponent} = useGroupModal();


    const {onDeleteProduct, onDeleteGroup} = useDelete({products, setProducts, showWarning});    
    const {onEditProduct, onEditGroup} = useEdit({products, setProducts, openEditProduct, openEditGroup});
 
    const {createProduct, createGroup} = useCreate({products, setProducts, openCreateProduct, openCreateGroup});

    const ItemWrapper = getItemWrapper({
        onDeleteProduct,
        onDeleteGroup,
        onEditProduct,
        onEditGroup
    });


    useEffect(() => {
        loadCategories().then((categories) => {
            setCategories(categories);
            setCurrentCategory(categories[0]);
        });

    }, []);

    useEffect(() => {
        if (currentCategory) {
            loadProducts(currentCategory.id).then((products) => {
                setProducts(products);
            });
        }
    }, [currentCategory]);



    return (
        <>
            <section className={styles.wrapper}>
                <div className={styles.controls}>
                    <Select 
                        selectClass = {styles.select}
                        optionClass = {styles.option}
                        optionItems = {categories.map(convertCategoryToOptionItem)}
                        initOptionItem = {currentCategory ? convertCategoryToOptionItem(currentCategory): undefined}
                        onChange = {(cat) => {
                            const category = categories.find((c) => c.id === cat.value);
                            if (category) {
                                setCurrentCategory(category);
                            }
                        }}
                    />
                    <div className={styles.buttons}>
                        <ButtonCPN 
                            type="normal"
                            label="Add Product"
                            onClick={createProduct}
                            />
                        <ButtonCPN 
                            type="normal"
                            label="Add Group"
                            onClick={createGroup}
                            />
                    </div>
                </div>
                <List 
                    items = {products}
                    ItemCPN = {ItemWrapper}
                    liClass = {styles.li}
                    ulClass = {styles.ul}
                />
            </section>
            <WarningModalComponent />
            <ProductModalComponent />
            <GroupModalComponent />
        </>
    )

}

ProductManagementSection.displayName = "ProductManagementSection";


/****************************
 * Helper functions
 */

async function loadCategories(): Promise<Category[]> {
    try {
        const res = await axios.get("/api/categories");
        return res.data;
    } catch (err) {
        throw err;
    }
}


const getLabel = (category: Category) => category.name;
const getValue = (category: Category) => category.id;

const convertCategoryToOptionItem = (category: Category): OptionItem<Category> => {
    return convertToOptionItem({item: category, getLabel, getValue});
}

async function loadProducts(catID: string): Promise<(Product|ProductGroup)[]> {
    try {
        const res = await axios.get(`/api/products/?catID=${catID}`);
        return res.data;
    } catch (err) {
        throw err;
    }
}




type getItemWrapperProps = {
    onDeleteProduct: (productID: string) => void;
    onDeleteGroup: (groupID: string) => void;
    onEditGroup: (groupID: string) => void;
    onEditProduct: (id: string) => void;
}

function getItemWrapper ({onDeleteProduct, onDeleteGroup, onEditGroup, onEditProduct}: getItemWrapperProps) {

    const ItemWrapper = (product: Product|ProductGroup) => {
        return (
            <>
                {
                    isProduct(product) ? (
                        <AdminProductBlockCPN {...product} onDelete={onDeleteProduct} onClick={onEditProduct} />)
                        : (<AdminProductGroupBlockCPN {...product} onDelete={onDeleteGroup} onClick={onEditGroup} onEditProduct={onEditProduct}/>)
                }
            </>
        )
    
    }

    return ItemWrapper;
}