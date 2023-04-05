import { useEffect, useState } from "react";

import ProductTabCPN from "@/components/basics/ProductTabCPN";
import LinksList from "@/components/generics/LinksList";
import { Product, ProductGroup } from "@/types/product";
import styles from "@styles/composites/ProductList.module.scss";
import ProductBlock from "../ProductBlock";
import ProductGroupBlock from "../ProductGroupBlock";



export type Props =  {
    products: (Product | ProductGroup)[];
    type: "grid" | "list";
} 

function ProductList({ products, type }: Props) {

    const  [productQuantities, setProductQuantities] = useState<(ProductQuantity|ProductGroupQuantity)[]>(getProductQuantity(products));

    useEffect(() => {
        setProductQuantities(getProductQuantity(products));
    }, [products]);


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

    const onQuantityChange = (id: string, quantity: number) => {
        setProductQuantities((prev) => {
            return prev.map((pq) => {
                if(isProductGroupQuantity(pq)) {
                    return {
                        ...pq,
                        quantities: pq.quantities.map((q) => {
                            if(q.id === id) {
                                return {
                                    ...q,
                                    quantity
                                }
                            }
                            return q;
                        })
                    }
                }

                if(pq.id === id) {
                    return {
                        ...pq,
                        quantity
                    }
                }
                
                return pq;
            })
        });
    }

    const ProductItemCPN = getProductItemCPN(
        onQuantityChange,
        productQuantities
    );

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


function getProductItemCPN(onQuantityChange: (id: string, quantity: number) => void, productQuantities: (ProductQuantity|ProductGroupQuantity)[]) {
    
    const ProductItemCPN = (props: Product | ProductGroup) => {
        
        
        if(isProductGroup(props)) {
            return <ProductGroupBlock {...props} 
                        onQuantityChange={onQuantityChange} 
                        quantities={(productQuantities.find(pq => pq.id === props.id) as ProductGroupQuantity).quantities}
                            />
        }
        
        return <ProductBlock {...props} 
                    onQuantityChange={onQuantityChange} 
                    quantity={(productQuantities.find(pq => pq.id === props.id) as ProductQuantity).quantity}
                    />
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



export type ProductQuantity = {
    id: string;
    quantity: number;
}

type ProductGroupQuantity = {
    id: string;
    quantities: ProductQuantity[];
}

function getProductQuantity(products: (Product|ProductGroup)[]): (ProductQuantity|ProductGroupQuantity)[] {
    return products.map((product) => {
        if(isProductGroup(product)) {
            return {
                id: product.id,
                quantities: product.products.map(p => ({id: p.id, quantity: 0}))
            }
        }

        return {
            id: product.id,
            quantity: 0
        }
    
    });
}

function isProductGroupQuantity(productQuantity: ProductQuantity|ProductGroupQuantity): productQuantity is ProductGroupQuantity {
    return (productQuantity as ProductGroupQuantity).quantities !== undefined;
}