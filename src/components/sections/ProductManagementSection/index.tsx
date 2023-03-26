import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import axios from "axios";

import { useWarningModal, ShowWarningProps } from "@/components/composites/WarningModal";

import { useState, useEffect } from "react";
import AdminProductBlockCPN from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN from "@/components/basics/AdminProductGroupBlock";
import { useProductModal } from "@/components/composites/ProductModal";

import { ProductImage } from "@/types/product";

import useDelete from "@/hooks/ProductManagementSection/useDelete";
import { useGroupModal } from "@/components/composites/ProductGroupModal";
import useEdit from "@/hooks/ProductManagementSection/useEdit";

import isProduct from "@/utils/isProduct";

export interface Props {
}



export default function ProductManagementSection({  }: Props) {
    

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);


    const {showWarning,  WarningModalComponent} = useWarningModal();
    const {openEditProduct, ProductModalComponent} = useProductModal();
    const {openEditGroup, GroupModalComponent} = useGroupModal();


    const {onDeleteProduct, onDeleteGroup} = useDelete({products, setProducts, showWarning});    
    const {onEditProduct, onEditGroup} = useEdit({products, setProducts, openEditProduct, openEditGroup});


    



    const ItemWrapper = getItemWrapper({
        onDeleteProduct,
        onDeleteGroup,
        onEditProduct,
        onEditGroup
    });


    useEffect(() => {
        loadProducts().then((products) => setProducts(products));
    }, []);


    return (
        <>
            <section className={styles.wrapper}>
                <List 
                    items = {products}
                    ItemCPN = {ItemWrapper}
                    liClass = {styles.li}
                    ulClass = {styles.ul}
                />
            </section>
            <WarningModalComponent />
            <ProductModalComponent />
        </>
    )

}

ProductManagementSection.displayName = "ProductManagementSection";


/****************************
 * Helper functions
 */

async function loadProducts(): Promise<(Product|ProductGroup)[]> {
    try {
        const res = await axios.get("/api/products");
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









