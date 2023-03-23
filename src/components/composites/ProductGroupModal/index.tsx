import styles from "@styles/composites/ProductModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";
import ImageCPN from "@/components/basics/ImageCPN";

import { RemoteImage } from "@/types/image";

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
} & ({
    type: "create";
    initName?: undefined;
    initProducts?: undefined;

} | {
    type: "edit";
    initName: string;
    initProducts: Product[];
})
    

export default function ProductModal({ type, onSave, onCancel, initName, initProducts, onEditProduct, onDeleteProduct 
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

ProductModal.displayName = "ProductModal";

const createImageObj = (image: RemoteImage | File) => {
    if(image instanceof File) return {
        src: URL.createObjectURL(image),
        alt: image.name
    };

    return image;
}

type ProductItemCPNProps = {
    onEditProduct: (id:string) => void;
    onDeleteProduct: (id:string) => void;
    product: Product;
}

const ProductItemCPN = ({product, onEditProduct, onDeleteProduct}:ProductItemCPNProps) => {

    return (
        <div className={styles.productItem} onClick={() => onEditProduct(product.id)}>
            <ProductTabCPN {...product}/>
            <ButtonCPN type="attention" label="Remove" onClick={() => onDeleteProduct(product.id)}/>
        </div>
    )
}