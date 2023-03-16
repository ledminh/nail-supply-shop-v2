import ProductTabCPN from "@/components/basics/ProductTabCPN";
import LinksList from "@/components/generics/LinksList";
import { Product, ProductGroup } from "@/types/product";
import styles from "@styles/composites/ProductList.module.scss";
import ProductBlock from "../ProductBlock";
import ProductGroupBlock from "../ProductGroupBlock";

import { OrderedProduct } from "@/types/product";

export interface Props {
    products: (Product | ProductGroup)[];
    type: "grid" | "list";
    addToCart?: (orderedProduct: OrderedProduct) => void;
}


export default function ProductList({ products, type, addToCart }: Props) {

    // Preprocess products to add path
    const _products = products.map((product) => {
        
        if(isProductGroup(product)) {
            return {
                ...product,
                path: `/products/${product.products[0].id}`
            }
        }

        return {
            ...product,
            path: `/products/${product.id}`
        }
        
    });



    // Render list UI
    if(type === "list") {
        

        return (
            <LinksList items = {_products}
                ItemCPN = {ProductTabCPN}
                liClass = {styles.li} 
                ulClass = {styles.ul}
                linkClass = {styles.link}
            />

        );
    }




    // Render grid UI

    const _addToCart = addToCart? addToCart : () => {};

    

    type ProductItemCPNProps = Product | ProductGroup;

    function ProductItemCPN(props: ProductItemCPNProps) {
        

        
        if(isProductGroup(props)) {
            

            return <ProductGroupBlock {...{...props, addToCart: _addToCart}} />
        }


        return <ProductBlock {...{...props, addToCart: _addToCart}} />
    }



    return (
        <LinksList items = {_products}
            ItemCPN = {ProductItemCPN }
            liClass = {styles.li} 
            ulClass = {styles.ul}
            linkClass = {styles.link}
        />

    );           
}

ProductList.displayName = "ProductList";





/***************************
 * Helpers
 */

function isProductGroup(product: Product | ProductGroup): product is ProductGroup {
    return (product as ProductGroup).products !== undefined;
}
