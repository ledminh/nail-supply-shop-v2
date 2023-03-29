import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import { Dispatch, SetStateAction } from "react";

import axios, {AxiosResponse} from "axios";

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
import { ProductApiResponse } from "@/pages/api/products";

export interface Props {
}



export default function ProductManagementSection({ }: Props) {

    const [reloadProducts, setReloadProducts] = useState<boolean>(false);

    const [products, setProducts] = useState<(Product | ProductGroup)[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    const { showWarning, WarningModalComponent } = useWarningModal();
    const { openEditProduct, openCreateProduct, ProductModalComponent } = useProductModal();
    const { openEditGroup, openCreateGroup, GroupModalComponent } = useGroupModal();


    const { onDeleteProduct, onDeleteGroup } = useDelete({ products, showWarning, setReloadProducts });
    const { createProduct, createGroup } = useCreate({ currentCategory, products, setProducts, openCreateProduct, openCreateGroup });
    const { onEditProduct, onEditGroup } = useEdit({ currentCategory, products, setProducts, openEditProduct, openEditGroup, setReloadProducts });



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
            loadProducts(currentCategory.id, setProducts);
        }
    }, [currentCategory]);


    useEffect(() => {
        if (reloadProducts) {
            setReloadProducts(false);
            
            if (currentCategory) {
                loadProducts(currentCategory.id, setProducts);
            }
        }
    }, [reloadProducts]);


    return (
        <>
            <section className={styles.wrapper}>
                <div className={styles.controls}>
                    {
                        categories.length !== 0 && currentCategory && (
                            <Select
                                selectClass={styles.select}
                                optionClass={styles.option}
                                optionItems={categories.map(convertCategoryToOptionItem)}
                                initOptionItem={convertCategoryToOptionItem(currentCategory)}
                                onChange={(cat) => {
                                    const category = categories.find((c) => c.id === cat.value);
                                    if (category) {
                                        setCurrentCategory(category);
                                    }
                                }}
                            />)
                    }

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
                    items={products}
                    ItemCPN={ItemWrapper}
                    liClass={styles.li}
                    ulClass={styles.ul}
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

async function loadCategories() {
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
    return convertToOptionItem({ item: category, getLabel, getValue });
}

async function loadProducts(catID: string, setProducts: Dispatch<SetStateAction<(Product | ProductGroup)[]>> ) {
    axios.get(`/api/products/?catID=${catID}`)
    .then(({data}:AxiosResponse<ProductApiResponse>) => {
        if (!data.success) {
            throw new Error(data.message);
        }
        else if(!data.products) {
            throw new Error("No products found");
        }


        setProducts(data.products);

    }).catch((err) => {
        throw err;
    });
}




type getItemWrapperProps = {
    onDeleteProduct: (productID: string) => void;
    onDeleteGroup: (groupID: string) => void;
    onEditGroup: (groupID: string) => void;
    onEditProduct: ({productID, groupID}: {productID:string, groupID?:string}) => void;
}

function getItemWrapper({ onDeleteProduct, onDeleteGroup, onEditGroup, onEditProduct }: getItemWrapperProps) {

    const ItemWrapper = (product: Product | ProductGroup) => {
        return (
            <>
                {
                    isProduct(product) ? (
                        <AdminProductBlockCPN {...product} onDelete={onDeleteProduct} onClick={onEditProduct} />)
                        : (<AdminProductGroupBlockCPN {...product} onDelete={onDeleteGroup} onClick={onEditGroup} onEditProduct={(id) => onEditProduct({productID:id, groupID: product.id})} />)
                }
            </>
        )

    }

    return ItemWrapper;
}