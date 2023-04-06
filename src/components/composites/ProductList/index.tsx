import { useEffect, useState, useRef } from "react";

import ProductTabCPN from "@/components/basics/ProductTabCPN";
import LinksList from "@/components/generics/LinksList";
import { Product, ProductGroup } from "@/types/product";
import styles from "@styles/composites/ProductList.module.scss";
import ProductBlock from "../ProductBlock";
import ProductGroupBlock from "../ProductGroupBlock";

import CartContext from "@/contexts/CartContext";

export type Props =  {
    products: (Product | ProductGroup)[];
    type: "grid" | "list";
} 




function ProductList({ products, type }: Props) {

    const [_products, setProducts] = useState(withPath(products));
    const [quantities, setQuantities] = useState<Record<string, number>>(toQuantites(products)); // product id -> quantity


    useEffect(() => {
        setProducts(withPath(products));
    }, [products]);


    if(type === "list") {
        
        return (
            <LinksList items = {_products}
                ItemCPN = {ProductTabCPN}
                liClass = {styles.li + ' ' + styles.list} 
                ulClass = {styles.ul + ' ' + styles.list}
                linkClass = {styles.link + ' ' + styles.list}
            />

        );
    }


    const ProductItemCPN = getProductItemCPN(quantities, setQuantities);

    return (
        <LinksList items = {_products}
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


function getProductItemCPN(quantities: Record<string, number>, setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>) {

    const setQuantity = (id: string, quantity: number) => {
        setQuantities((prev) => {
            return {
                ...prev,
                [id]: quantity
            }
        });
    }


    
    
    
    
    const ProductItemCPN = (props: Product | ProductGroup) => {
    
        return (
            <CartContext.Consumer>
                {({addToCart}) => {
                    return (
                        isProductGroup(props) ?
                        <ProductGroupBlock {...props} addToCart = {addToCart} setInitQuantity={setQuantity} initQuantities={quantities}/> :
                        <ProductBlock {...props} addToCart = {addToCart} setInitQuantity={setQuantity} initQuantity={quantities[props.id]}/>
                    ) 
    
                }}
            </CartContext.Consumer>
        )
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

function toQuantites(products: (Product | ProductGroup)[]) {
    return products.reduce((acc, cur) => {
        if(isProductGroup(cur)) {
            cur.products.forEach(p => {
                acc[p.id] = 0;
            });
        } else {
            acc[cur.id] = 0;
        }

        return acc;
    }, {} as Record<string, number>);
}

