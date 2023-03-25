import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import axios from "axios";

import { useState, useEffect } from "react";
import AdminProductBlockCPN from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN from "@/components/basics/AdminProductGroupBlock";

export interface Props {
}


export default function ProductManagementSection({  }: Props) {

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);


    const onDelete = (productID: string) => {};
    const onClick = (productID: string) => {};   


    useEffect(() => {
        loadProducts().then((products) => setProducts(products));
    }, []);
    
    
    const ItemWrapper = (product: Product|ProductGroup) => {
        return (
            <>
                {
                    isProduct(product) ? (
                        <AdminProductBlockCPN {...product} onDelete={()=>{}} onClick={()=>{}} />)
                        : (<AdminProductGroupBlockCPN {...product} onDelete={onDelete} onClick={onClick} onEditProduct={()=>{}}/>)
                }
            </>
        )
    
    }


    return (
        <section className={styles.wrapper}>
            <List 
                items = {products}
                ItemCPN = {ItemWrapper}
                liClass = {styles.li}
                ulClass = {styles.ul}
            />
        </section>
    )

}

ProductManagementSection.displayName = "ProductManagementSection";


/****************************
 * Helper functions
 */

function loadProducts(): Promise<(Product|ProductGroup)[]> {
    return axios.get("/api/products")
        .then((res) => res.data)
        .catch((err) => {
            throw err;
        });
}

function isProduct (product: Product|ProductGroup): product is Product {
    return (product as Product).price !== undefined;
}