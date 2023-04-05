import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import styles from "@styles/composites/ProductGroupBlock.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";

import type { Product } from "@/types/product";

import { useState, MouseEventHandler, useEffect } from "react";
import { OrderedProduct } from "@/types/product";
import Select, {convertToOptionItem, OptionItem} from "@/components/generics/Select";
import { useCart } from "@/contexts/CartContext";
import { ProductQuantity } from "../ProductList";




export interface Props {
    name: string;
    products: Product[];
    onPathChange?: (newPath:string)=> void;
    quantities: ProductQuantity[];
    onQuantityChange: (id:string, newQuantity: number) => void;
}


export default function ProductGroupBlock({ name, products, onPathChange, quantities, onQuantityChange}: Props) {

    const [selectedProduct, setSelectedProduct] = useState(products[0]);
    const [quantity, setQuantity] = useState(0);

    const { addToCart } = useCart();

    useEffect(() => {
        if(onPathChange) {
            onPathChange(`/product/${selectedProduct.id}`);
        }

        setQuantity(quantities.find(q => q.id === selectedProduct.id)?.quantity || 0);
    }, [selectedProduct]);




    const onAdd:MouseEventHandler<HTMLButtonElement>  = (e) => {
        e.preventDefault();
        if(quantity <= 0) return;
        
        addToCart({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity,
            image: selectedProduct.images[0],
        });

        onQuantityChange(selectedProduct.id, 0);

    };

    const onSelect = (selectedOption: OptionItem<Product>) => {
        const curProduct = products.find(p => p.id === selectedOption.id);

        if(curProduct){
            setSelectedProduct(curProduct);

        }
    };

    
    const productOptions = getProductOptions(products);

    return (
        <div className={styles.wrapper + (quantity> 0? ' ' + styles.highLighted: '' )}>
            <ImageCPN
                image = {selectedProduct.images[0]}
                size = "medium"
                className={styles.image}
            /> 
            <div className={styles.text}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.price}>
                    {selectedProduct.price}
                </p>
                <Select
                    optionItems = {productOptions}
                    onChange = {onSelect}
                    selectClass={styles.select}
                    initOptionItem={productOptions[0]}
                    />
                <div className={styles.controls}>
                    <ButtonCPN
                        type="normal"
                        label="ADD TO CART"
                        className={styles.button}
                        onClick={onAdd}
                        disabled={quantity === 0}
                        />
                    <QuantityPickerCPN
                        value={quantity}
                        onChange ={(q) => onQuantityChange(selectedProduct.id, q)}
                        buttonClassName = {styles.quantityButton}
                        valueClassName = {styles.quantityValue}
                        className = {styles.quantityPicker}
                    />
                </div>
            </div>
        </div>    
    );
}

ProductGroupBlock.displayName = "ProductBlock";

/*******************
 * Helpers
 */

function getProductOptions(products: Product[]): OptionItem<Product>[] {
    const getValue = (product: Product) => {
        return product.id;
    }

    const getLabel = (product: Product) => {
        return product.name;
    }

    return products.map(product => convertToOptionItem({item:product, getValue, getLabel}));
}   