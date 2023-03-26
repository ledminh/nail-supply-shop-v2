import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import axios from "axios";

import { useWarningModal, ShowWarningProps } from "@/components/composites/WarningModal";

import { useState, useEffect } from "react";
import AdminProductBlockCPN from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN from "@/components/basics/AdminProductGroupBlock";
import { productManagementConfig } from "@/config";
import { useProductModal } from "@/components/composites/ProductModal";

const {warningMessages} = productManagementConfig;

export interface Props {
}



export default function ProductManagementSection({  }: Props) {

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);


    const {showWarning,  WarningModalComponent} = useWarningModal();

    const {onDeleteProduct, onDeleteGroup} = useDelete({products, setProducts, showWarning});    
    

    const {openEditProduct, close, ProductModalComponent} = useProductModal();

    const onEditProduct = (productID: string) => {
        const product = products.find((product) => product.id === productID);

        if (!product) {
            throw new Error("Product not found");
        }

        if(!isProduct(product)) {
            throw new Error("Product is a group");
        }

        openEditProduct({
            product,
            onSave: ({serialNumber, name, intro, details, price, images}) => {
                const formData = new FormData();

                

                formData.append("serialNumber", serialNumber);
                formData.append("name", name);
                formData.append("intro", intro);
                formData.append("details", details);
                formData.append("price", price.toString());
                
                

            },
            onCancel: () => {
                console.log("cancel");
            }

        });


    }


    const ItemWrapper = getItemWrapper({
        onDeleteProduct,
        onDeleteGroup,
        onEditProduct,
        onClick: (productID: string) => {
            console.log("click");
        },
        
    });

    

    useEffect(() => {
        loadProducts().then((products) => setProducts(products));
    }, []);
    
    
    


    return (
        <>
            <section className={styles.wrapper}>
                <List 
                    items = {products}
                    ItemCPN = {ItemWrapper}
                    liClass = {styles.li}
                    ulClass = {styles.ul}
                />
            </section>
            <WarningModalComponent />
        </>
    )

}

ProductManagementSection.displayName = "ProductManagementSection";


/****************************
 * Helper functions
 */

async function loadProducts(): Promise<(Product|ProductGroup)[]> {
    try {
        const res = await axios.get("/api/products");
        return res.data;
    } catch (err) {
        throw err;
    }
}

function isProduct (product: Product|ProductGroup): product is Product {
    return (product as Product).price !== undefined;
}


type getItemWrapperProps = {
    onDeleteProduct: (productID: string) => void;
    onDeleteGroup: (groupID: string) => void;
    onClick: (productID: string) => void;
    onEditProduct: (id: string) => void;

}

function getItemWrapper ({onDeleteProduct, onDeleteGroup, onClick, onEditProduct}: getItemWrapperProps) {

    const ItemWrapper = (product: Product|ProductGroup) => {
        return (
            <>
                {
                    isProduct(product) ? (
                        <AdminProductBlockCPN {...product} onDelete={onDeleteProduct} onClick={onEditProduct} />)
                        : (<AdminProductGroupBlockCPN {...product} onDelete={onDeleteGroup} onClick={onClick} onEditProduct={onEditProduct}/>)
                }
            </>
        )
    
    }

    return ItemWrapper;
}

type useDeleteProps = {
    products: (Product|ProductGroup)[];
    setProducts: React.Dispatch<React.SetStateAction<(Product|ProductGroup)[]>>;
    showWarning: (warningProps: ShowWarningProps) => void;
}

function useDelete ({products, setProducts, showWarning}:useDeleteProps) {
    const [toBeDeletedProductID, setToBeDeletedProductID] = useState<string|null>(null);
    const [toBeDeletedGroupID, setToBeDeletedGroupID] = useState<string|null>(null);

    const onDeleteProduct = (productID: string) => {
        const productName = products.find((product) => product.id === productID)?.name;

        if(!productName) {
            throw new Error("Product not found");
        }

        showWarning({
            beforeWarning: () => setToBeDeletedProductID(productID),
            message: warningMessages.deleteProduct(productName),
            onOK: () => {
                axios.post(`/api/products/?type=delete-single-product&id=${productID}`)
                .then(({data}) => {
                    setProducts(data);
                    setToBeDeletedProductID(null);
                })
                .catch((err) => {
                    console.error(err);
                });
            },
            onCancel: () => {
                setToBeDeletedProductID(null);
            }
        })
        
    }

    const onDeleteGroup = (groupID: string) => {
        const groupName = products.find((product) => product.id === groupID)?.name;

        if(!groupName) {
            throw new Error("Group not found");
        }

        showWarning({
            beforeWarning: () => setToBeDeletedGroupID(groupID),
            message: warningMessages.deleteGroup(groupName),
            onOK: () => {
                axios.post(`/api/products/?type=delete-group&id=${groupID}`)
                .then(({data}) => {
                    setProducts(data);
                    setToBeDeletedGroupID(null);
                })
                .catch((err) => {
                    console.error(err);
                });
            },
            onCancel: () => {
                setToBeDeletedGroupID(null);
            }
        })

    }

    return {
        onDeleteProduct,
        onDeleteGroup
    }
}
