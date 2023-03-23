import styles from "@styles/composites/ProductGroupModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";

import { useState } from "react";
import { Product } from "@/types/product";
import List from "@/components/generics/List";
import ProductTabCPN from "@/components/basics/ProductTabCPN";

type onSaveProps = {
    name: string,
    products: Product[]
}

export type Props = {
    onSave: (props:onSaveProps) => void;
    onCancel: () => void;
    onEditProduct: (productID:string) => void;
    onDeleteProduct: (productID:string) => void;
    onAddNewProduct: () => void;
} & ({
    type: "create";
    initName?: undefined;
    initProducts?: undefined;

} | {
    type: "edit";
    initName: string;
    initProducts: Product[];
})
    

export default function ProductGroupModal({ type, onSave, onCancel, initName, initProducts, onEditProduct, onDeleteProduct, onAddNewProduct 
}: Props) {

    const [name, setName] = useState(initName ?? "");
    const [products, setProducts] = useState<Product[]>(initProducts ?? []);

    
    const _onSave = () => {
        if(!name) return;

        
        onSave({
            name, products
        });
    };


    const FooterComponent = () => {
        return (
            <fieldset className={styles.footer}>
                <ButtonCPN type="normal" 
                    label={type === 'edit'? 'Save' : 'Add'} 
                    disabled = {!name} 
                    onClick={_onSave}/>
                <ButtonCPN type="attention" 
                    label="Cancel" 
                    onClick={onCancel}/>
            </fieldset>
        );
    };

    const title = type === 'edit'? 'Edit Product Group' : 'Add Product Group';
    
    return (
        <ModalLayout title={title} FooterComponent={FooterComponent} type="normal">
            <form className={styles.form}>
                <fieldset className={styles.fieldset}>
                    <legend>Info</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                </fieldset>
                <div className={styles.productsHeader}>
                    <h4>Products</h4>
                    <ButtonCPN
                        type="normal"
                        label="Add New Product"
                        className={styles.addProductButton}
                        onClick={() => onAddNewProduct()}
                    />
                </div>
                <div className={styles.products}>
                    <List 
                        items = {products.map((product) => ({id: product.id, product:product, onEditProduct, onDeleteProduct }))}
                        ItemCPN = {ProductItemCPN}
                        liClass = {styles.liProduct}
                        ulClass = {styles.ulProduct}
                    />
                </div>
            </form>
        </ModalLayout>
    );
}

ProductGroupModal.displayName = "ProductGroupModal";


type ProductItemCPNProps = {
    onEditProduct: (id:string) => void;
    onDeleteProduct: (id:string) => void;
    product: Product;
}

const ProductItemCPN = ({product, onEditProduct, onDeleteProduct}:ProductItemCPNProps) => {

    return (
        <div className={styles.productItem} onClick={() => onEditProduct(product.id)}>
            <ProductTabCPN {...product} detailed/>
            <ButtonCPN type="danger" label="Remove" onClick={() => onDeleteProduct(product.id)}/>
        </div>
    )
}