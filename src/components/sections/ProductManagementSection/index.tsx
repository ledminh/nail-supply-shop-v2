import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import axios from "axios";

import { useState, useEffect } from "react";

export interface Props {
}


export default function ProductManagementSection({  }: Props) {

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);

    useEffect(() => {
        loadProducts().then((products) => setProducts(products));
    }, []);
    
    


    return (
        <section className={styles.wrapper}>
            <List 
                items = {products}
                ItemCPN = {(product) => <>{product.name}</>}
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