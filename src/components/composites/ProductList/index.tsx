import { memo, useEffect } from "react";

import ProductTabCPN from "@/components/basics/ProductTabCPN";
import LinksList from "@/components/generics/LinksList";
import { Product, ProductGroup } from "@/types/product";
import styles from "@styles/composites/ProductList.module.scss";
import ProductBlock from "../ProductBlock";
import ProductGroupBlock from "../ProductGroupBlock";

import { OrderedProduct } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

// export type Props =  {
//     products: (Product | ProductGroup)[];
// } & (
//     {
//         type: "grid";
//         addToCart: (orderedProduct: OrderedProduct) => void;
//     } | {
//         type: "list";
//         addToCart: undefined;
//     }
// );

export type Props =  {
    products: (Product | ProductGroup)[];
    type: "grid" | "list";
} 

function ProductList({ products, type }: Props) {

    

    if(type === "list") {
        
        return (
            <LinksList items = {withPath(products)}
                ItemCPN = {ProductTabCPN}
                liClass = {styles.li + ' ' + styles.list} 
                ulClass = {styles.ul + ' ' + styles.list}
                linkClass = {styles.link + ' ' + styles.list}
            />

        );
    }


    const ProductItemCPN = getProductItemCPN();

    return (
        <LinksList items = {withPath(products)}
            ItemCPN = {ProductItemCPN }
            liClass = {styles.li + ' ' + styles.grid} 
            ulClass = {styles.ul + ' ' + styles.grid}
            linkClass = {styles.link + ' ' + styles.grid}
        />

    );           
}

ProductList.displayName = "ProductList";

export default ProductList;


/***************************
 * Helpers
 */

function isProductGroup(product: Product | ProductGroup): product is ProductGroup {
    return (product as ProductGroup).products !== undefined;
}





function getProductItemCPN() {
    
    const ProductItemCPN = (props: Product | ProductGroup) => {
        
        
        if(isProductGroup(props)) {
            return <ProductGroupBlock {...props} />
        }
        
        return <ProductBlock {...props}  />
    }


    return ProductItemCPN;
}




function withPath(products: (Product | ProductGroup)[]) {
    return products.map((product) => {
        
        if(isProductGroup(product)) {
            return {
                ...product,
                path: `/product/${product.products[0].id}`
            }
        }

        return {
            ...product,
            path: `/product/${product.id}`
        }
        
    });
}