import styles from "@styles/composites/ProductGroupModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";

import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";
import List from "@/components/generics/List";
import ProductTabCPN from "@/components/basics/ProductTabCPN";

import ProductModal, {Props as ProductModalProps} from "@components/composites/ProductModal";

import WarningModal from "@components/composites/WarningModal";


type PreparedProduct = Omit<Product, 'images'> & {
    images: (ProductImage | File)[];
};

type onSaveProps = {
    name: string,
    products: PreparedProduct[]
}

export type Props = {
    onSave: (props:onSaveProps) => void;
    onCancel: () => void;
} & ({
    type: "create";
    initName?: undefined;
    initProducts?: undefined;

} | {
    type: "edit";
    initName: string;
    initProducts: Product[];
})
    

export default function ProductGroupModal({ type, onSave, onCancel, initName, initProducts}: Props) {

    const [name, setName] = useState(initName ?? "");
    const [products, setProducts] = useState<PreparedProduct[]>(initProducts ?? []);
    const [show, setShow] = useState(true);
    
    const [productModalType, setProductModalType] = useState<'create'|'edit'>('create');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [beingEditedProduct, setBeingEditedProduct] = useState<PreparedProduct | null>(null);
    

    const [toBeDeletedProductID, setToBeDeletedProductID] = useState(-1);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);


    const _onSave = () => {
        if(!name) return;

        
        onSave({
            name, products
        });
    };

    const onEditProduct = (id:string) => {
        const product = products.find((product) => product.id === id);
        if(!product) return;

        setBeingEditedProduct(product);
        setProductModalType('edit');
        setIsProductModalOpen(true);
        setShow(false);
    };

    const onAddNewProduct = () => {
        setProductModalType('create');
        setIsProductModalOpen(true);
        setShow(false);
    };

    const onDeleteProduct = (id:string) => {
        const index = products.findIndex((product) => product.id === id);
        if(index === -1) return;

        setToBeDeletedProductID(index);
        setIsWarningModalOpen(true);
        setShow(false);
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
        <>
            {
            show && (
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
                            {
                                products.length === 0 && (
                                    <div className={styles.noProduct}>
                                        <p>No Product</p>
                                    </div>
                                )
                            }
                            <List 
                                items = {products.map((product) => ({id: product.id, product:product, onEditProduct, onDeleteProduct }))}
                                ItemCPN = {ProductItemCPN}
                                liClass = {styles.liProduct}
                                ulClass = {styles.ulProduct}
                            />
                        </div>
                    </form>
                </ModalLayout>
                )
            }
            {
                isProductModalOpen && (
                    productModalType === 'edit' ? (
                    <ProductModal
                        type='edit'
                        initSerialNumber = {beingEditedProduct?.id || ""} 
                        initName = {beingEditedProduct?.name || ""}
                        initIntro = {beingEditedProduct?.intro || ""}
                        initDetails = {beingEditedProduct?.details || ""}
                        initPrice = {beingEditedProduct?.price || 0}
                        initImages = {convertImages(beingEditedProduct!.images)}

                        onSave={({serialNumber, name, intro, details, price, images})  => {
                            const index = products.findIndex((product) => product.id === beingEditedProduct?.id);
                            if(index === -1) return;

                            const newProducts = [...products];
                            
                            const newImages:(ProductImage |File)[] = images.map((image) => {
                                if(image instanceof File) return image;
                                
                                const file = beingEditedProduct?.images.find((productImg) => (productImg as File).name === image.id);

                                if(file) return file;

                                return image;
                            });

                            newProducts[index] = {
                                id: serialNumber,
                                categoryID: beingEditedProduct?.categoryID || "",
                                name,
                                intro,
                                details,
                                price,
                                images: newImages
                            };

                            setProducts(newProducts);
                            setIsProductModalOpen(false);
                            setBeingEditedProduct(null);
                            setShow(true);
                        }}
                        onCancel={() => {
                            setIsProductModalOpen(false);
                            setShow(true);
                        }}
                        />
                ): (
                    <ProductModal
                        type='create'
                        onSave={({serialNumber, name, intro, details, price, images})  => {
                            const newProducts = [...products];
                            newProducts.push({
                                id: serialNumber,
                                categoryID: "",
                                name,
                                intro,
                                details,
                                price,
                                images
                            });

                            setProducts(newProducts);
                            setIsProductModalOpen(false);

                            setShow(true);
                        }}
                        onCancel={() => {
                            setIsProductModalOpen(false);
                            setShow(true);
                        }}
                    />
                ))
            }
            {
                isWarningModalOpen && (
                    <WarningModal
                        message="Are you sure you want to remove this product?"
                        onOK={() => {
                            const newProducts = [...products];

                            newProducts.splice(toBeDeletedProductID, 1);

                            setProducts(newProducts);
                            
                            setIsWarningModalOpen(false);
                            setToBeDeletedProductID(-1);
                            setShow(true);
                        }}
                        onCancel={() => {
                            setIsWarningModalOpen(false);
                            setShow(true);
                        }}
                    />
                )
            }
        </>
        

    );
}

ProductGroupModal.displayName = "ProductGroupModal";




/*********************************
 * ProductItemCPN
 */
type ProductItemCPNProps = {
    onEditProduct: (id:string) => void;
    onDeleteProduct: (id:string) => void;
    product: PreparedProduct;
}

const ProductItemCPN = ({product, onEditProduct, onDeleteProduct}:ProductItemCPNProps) => {

    return (
        <div className={styles.productItem} onClick={() => onEditProduct(product.id)}>
            <ProductTabCPN {...convertPreparedProductToProduct(product)} detailed/>
            <ButtonCPN type="danger" label="Remove" onClick={(e) => {
                e.stopPropagation();
                onDeleteProduct(product.id);
            }}/>
        </div>
    )
};


const convertPreparedProductToProduct = (preparedProduct:PreparedProduct):Product => {
    const {images} = preparedProduct;

    const newImages = convertImages(images);

    return {
        ...preparedProduct,
        images: newImages
    };
}

const convertImages = (images: (ProductImage | File)[]):ProductImage[] => {
    const newImages = images.map((image) => {
        if(image instanceof File) return {src: URL.createObjectURL(image), alt: image.name, id: image.name};
        return image;
    });

    return newImages;
}