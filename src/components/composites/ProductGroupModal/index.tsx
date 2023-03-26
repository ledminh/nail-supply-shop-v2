import styles from "@styles/composites/ProductGroupModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";

import { useState, useEffect } from "react";
import { Product, ProductImage } from "@/types/product";
import List from "@/components/generics/List";
import ProductTabCPN from "@/components/basics/ProductTabCPN";

import ProductModal, {Props as ProductModalProps, useProductModal} from "@components/composites/ProductModal";

import WarningModal, { useWarningModal } from "@components/composites/WarningModal";

import type {ProductGroup} from '@/types/product';

import { productManagementConfig } from "@/config";

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


    const {showWarning, WarningModalComponent} = useWarningModal();
    const {openEditProduct, openCreateProduct, ProductModalComponent } = useProductModal();

    const _onSave = () => {
        if(!name) return;

        
        onSave({
            name, products
        });
    };


    const onAddProduct = () => {
        setShow(false);

        openCreateProduct({
            onSave: ({serialNumber, name, intro, details, price, images}) => {
                const newProduct:PreparedProduct = {
                    id: serialNumber,
                    categoryID: products[0].categoryID,
                    name,
                    intro,
                    details,
                    price,
                    images
                };

                setProducts([newProduct, ...products]);

                setShow(true);
            },

            onCancel: () => {
                setShow(true);
            }
        });


    };


    const onEditProduct = (id:string) => {
        const product = products.find((product) => product.id === id);

        if(!product) return;


        setShow(false);

        openEditProduct({
            product: convertToProduct(product),
            onSave: ({serialNumber, name, intro, details, price, images}) => {
                const oldImages = product.images;

                const newImages = images.map((image) => {
                    if(image instanceof File) return image;
                    
                    const oldImage = oldImages.find((oldImage) => (oldImage as File).name === image.id);

                    if(oldImage) return oldImage;

                    return image;

                });

                const newProduct = {
                    ...product,
                    id: serialNumber,
                    name,
                    intro,
                    details,
                    price,
                    images: newImages
                };

                const newProducts = products.map((product) => {
                    if(product.id === id) return newProduct;
                    return product;
                });

                setProducts(newProducts);

                setShow(true);


            },
            onCancel: () => {
                setShow(true);
            }
        });
        
    };

    const onDeleteProduct = (id:string) => {
        const product = products.find((product) => product.id === id);

        if(!product) return;

        const {warningMessages} = productManagementConfig;

        setShow(false);

        showWarning({
            message: warningMessages.deleteProduct(product.name),
            onOK: () => {
                const newProducts = products.filter((product) => product.id !== id);
                setProducts(newProducts);
                setShow(true);
            },
            onCancel: () => {
                setShow(true);
            }
        });
    
    };

    const  ProductItemWrapper = getProductItemWrapper({
        onEditProduct, 
        onDeleteProduct
    });




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
                                onClick={() => onAddProduct()}
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
                                items = {products}
                                ItemCPN = {ProductItemWrapper}
                                liClass = {styles.liProduct}
                                ulClass = {styles.ulProduct}
                            />
                        </div>
                    </form>
                </ModalLayout>
                )
            }
            <ProductModalComponent />
            <WarningModalComponent />
        </>
        

    );
}

ProductGroupModal.displayName = "ProductGroupModal";



/*************************
 * getProductItemWrapper *
 */

type getProductItemWrapperProps = {
    onEditProduct: (id:string) => void;
    onDeleteProduct: (id:string) => void;
}

function getProductItemWrapper ({onEditProduct, onDeleteProduct}:getProductItemWrapperProps) {

    const ProductItemWrapper = (product:PreparedProduct) => {
        return (
            <div className={styles.productItem} onClick={() => onEditProduct(product.id)}>
                <ProductTabCPN {...convertToProduct(product)} detailed/>
                <ButtonCPN type="danger" label="Remove" onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProduct(product.id);
                }}/>
            </div>
        );
    }

    return ProductItemWrapper;
}


function convertToProduct(product:PreparedProduct):Product {
    return {
        ...product,
        images: convertToProductImages(product.images)
    };
}

function convertToProductImages (images:(ProductImage | File)[]):ProductImage[]  {
    return images.map((image) => {
        if(image instanceof File) {
            return {
                id: image.name,
                src: URL.createObjectURL(image),
                alt: image.name
            };
        }
        return image;
    });

}



/*************************
 * useProductGroupModal *
 */

export type OpenEditGroupProps = {
    productGroup:ProductGroup;
    onSave?:(props:onSaveProps) => void;
    onCancel?:() => void;
};

export function useGroupModal () {
    const [show, setShow] = useState(false);
    const [type, setType] = useState<'edit' | 'create'>('create');
    const [productGroup, setProductGroup] = useState<ProductGroup|null>(null);

    const [onSave, setOnSave] = useState<(props:onSaveProps) => void>(() => () => {});
    const [onCancel, setOnCancel] = useState<() => void>(() => () => {});

    const openEditGroup = (
        {
            productGroup,
            onSave,
            onCancel
        }:OpenEditGroupProps) => {
        setProductGroup(productGroup);
        setOnSave(onSave || (() => () => {}));
        setOnCancel(onCancel || (() => () => {}));
        setType('edit');
        setShow(true);
    };

    const openCreateGroup = () => {
        setProductGroup(null);
        setType('create');
        setShow(true);
    };


    const GroupModalComponent = () => {

        return (
            <>
                {
                    show && (
                        type === 'edit'?
                        <ProductGroupModal
                            type="edit"
                            onSave={() => {}}
                            onCancel={() => setShow(false)}
                            initName={productGroup!.name}
                            initProducts={productGroup!.products}
                            />:
                        <ProductGroupModal
                            type="create"
                            onSave={(props) => {
                                onSave(props);
                                setShow(false);

                            }}
                            onCancel={() => {
                                onCancel();
                                setShow(false);
                            }}
                            />
                    )
                }
            </>
        );
    };


    return {
        GroupModalComponent,
        openEditGroup,
        openCreateGroup
    };
}

