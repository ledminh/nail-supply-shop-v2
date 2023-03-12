import ProductTabCPN from "@/components/basics/ProductTabCPN";
import LinksList from "@/components/generics/LinksList";
import { Product } from "@/types/product";
import styles from "@styles/composites/ProductList.module.scss";

export interface Props {
    products: Product[]
}


export default function ProductList({ products }: Props) {

    const _products = products.map((product) => {
        return {
            ...product,
            path: `/products/${product.id}`
        }
    })

    return (
        <LinksList 
            items = {_products}
            ItemCPN = {ProductTabCPN}
            liClass = {styles.li} 
            ulClass = {styles.ul}
            linkClass = {styles.link}
        />

    );
}

ProductList.displayName = "ProductList";