import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";

import { Product, ProductGroup } from "@/types/product";
import {useState, useEffect} from "react";

import { ProductApiResponse } from "@/pages/api/products";

import axios, { AxiosResponse } from "axios";

import { RemoteImage } from "@/types/image";

import AdminProductBlockCPN, {Props as AdminProductBlockProps} from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN, {Props as AdminProductGroupBlockProps} from "@/components/basics/AdminProductGroupBlock";

export interface Props {
}


export default function ProductManagementSection({  }: Props) {

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);

    // const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    // const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

    // const [toBeDeletedCategoryID, setToBeDeletedCategoryID] = useState<string | null>(null);
    // const [categoryModalType, setCategoryModalType] = useState<'create' | 'edit'|null>(null);

    // const [beingEditedCategory, setBeingEditedCategory] = useState<Category | null>(null);

    // const getCategoryName = (catID: string) => {
    //     return getCategoryProps({categories, categoryID: catID, props: ['name']}).name || '';
    // }

    useEffect(() => {
        axios.get('/api/products')
            .then((res:AxiosResponse<ProductApiResponse>) => {
                setProducts(res.data as (Product|ProductGroup)[]);

            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    /********************************
     * Functions for CategoryModal
     */
    const onDelete = (catID: string) => {
        // setToBeDeletedCategoryID(catID);
        // setIsWarningModalOpen(true);
    }

    const onEditProduct = (catID: string) => {
        // setCategoryModalType('edit');
        // setBeingEditedCategory(categories.find((cat) => cat.id === catID)!);
        // setIsCategoryModalOpen(true);
    }

    const onEditProductGroup = (catID: string) => {
        // setCategoryModalType('edit');
        // setBeingEditedCategory(categories.find((cat) => cat.id === catID)!);
        // setIsCategoryModalOpen(true);
    }

    const onCreate = () => {
        // setCategoryModalType('create');
        // setIsCategoryModalOpen(true);

    }

    const deleteCategory = (catID: string) => {
        // axios.post(`/api/delete?type=cat-image&filename=${getCategoryProps({categories, categoryID: catID, props: ['image']}).image?.src}`)
        //     .then(() => {
                
        //     axios.post(`/api/categories/?type=delete&id=${catID}`)
        //         .then(({data}) => {
        //             setCategories(data);
        //         })
        //         .catch((err) => {
        //             console.error(err);
        //         });
        // })
    }

    const createNewCategory = (name: string, description: string, image: File) => {
        // // Upload the image first
        // const imageFormData = new FormData();
        // imageFormData.append('cat-image', image);

        // axios.post('/api/upload?type=cat-image', imageFormData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // }).then((res) => res.data)
        // .then((imageData) => {
            
        //     const formData = new FormData();

        //     formData.append('name', name);
        //     formData.append('description', description);
        //     formData.append('imageFileName', imageData.filename);

        //     return axios.post('/api/categories?type=create', formData);
        // }).then((res) => res.data)
        // .then((data) => {

        //     setCategories([data, ...categories]);
        // })
        // .catch((err) => {
        //     console.error(err);
        // });
    };

    const updateCategory = (catID: string, name: string, description: string, image: File | RemoteImage) => {
        // const formData = new FormData();

        // formData.append('id', catID);
        // formData.append('name', name);
        // formData.append('description', description);

        // // image is not instanceof File --> it is a RemoteImage --> user did not change the image
        // if(!(image instanceof File)) {
        //     axios.post('/api/categories?type=update', formData)
        //         .then((res) => res.data)
        //         .then((data) => {
        //             setCategories([data, ...categories.filter((cat) => cat.id !== catID)]);
        //         })
        //         .catch((err) => {
        //             console.error(err);
        //         });
        // }
        // else {
        //     // Delete the old image first
        //     axios.post(`/api/delete?type=cat-image&filename=${getCategoryProps({categories, categoryID: catID, props: ['image']}).image?.src}`)
        //         .then(() => {
        //             // Upload the new image            
        //             const imageFormData = new FormData();
        //             imageFormData.append('cat-image', image);

        //             return axios.post('/api/upload?type=cat-image', imageFormData, {
        //                 headers: {
        //                     'Content-Type': 'multipart/form-data'
        //             }});
        //         })
        //     .then((res) => res.data)
        //     .then((imageData) => {
        //         console.log(imageData);
        //         formData.append('imageFileName', imageData.filename);
        //         return axios.post('/api/categories?type=update', formData);
        //     }).then((res) => res.data)
        //     .then((data) => {
        //         setCategories(data);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
        // }
    }

    const convertToProductItem = (product: Product | ProductGroup) => {
        if(isProduct(product)){
            return {
                id: product.id,
                onDelete,
                onClick: onEditProduct,
                product
            }
        }
        else {
            return {
                id: products[0].id,
                onDelete,
                onClick: onEditProductGroup,
                onEditProduct: onEditProduct,
                productGroup: product
            }
        }
    
    }

    return (
        <>
            <section className={styles.wrapper}>
                <List 
                    items = {products.map(convertToProductItem)}
                    ItemCPN = {ItemCPN}
                    liClass = {styles.li}
                    ulClass = {styles.ul}
                />
            </section>
            {/* {
                isCategoryModalOpen &&  (
                    categoryModalType === 'create'?
                    <CategoryModal type='create' 
                        onSave={({name, description, image}) => {
                            
                            createNewCategory(name, description, image as File);
                            setIsCategoryModalOpen(false);
                            setCategoryModalType(null);
                        }} 
                        onCancel={() => {
                            setIsCategoryModalOpen(false);
                            setCategoryModalType(null);
                        }}
                        /> : 
                        <CategoryModal type='edit' 
                            onSave={({name, description, image}) => {
                                updateCategory(beingEditedCategory!.id, name, description, image);
                                setIsCategoryModalOpen(false);
                                setCategoryModalType(null);
                                setBeingEditedCategory(null);
                            }} 
                            onCancel={() => {
                                setIsCategoryModalOpen(false);
                                setCategoryModalType(null);
                                setBeingEditedCategory(null);
                            }}
                            initName = {beingEditedCategory?.name || ''} 
                            initDescription = {beingEditedCategory?.description || ''} 
                            initImage = {beingEditedCategory?.image as RemoteImage} 
                            />)
            }
            {
                isWarningModalOpen && (
                    <WarningModal message={categoryManagementConfig.warningMessage(getCategoryName(toBeDeletedCategoryID!))}
                        onOK={() => {
                            deleteCategory(toBeDeletedCategoryID!);
                            setIsWarningModalOpen(false);
                        }} 
                        onCancel={() => {
                            setToBeDeletedCategoryID(null);
                            setIsWarningModalOpen(false);
                        }}
                        />)
            } */}
        </>
    );
}

ProductManagementSection.displayName = "ProductManagementSection";




interface ItemCPNProps {
    onDelete: (id: string) => void;
    onClick: (id: string) => void;
    product?: Product;
    productGroup?: ProductGroup;
    onEditProduct?: (productID: string) => void;
}

const ItemCPN = ({
    onDelete,
    onClick,
    onEditProduct,
    product,
    productGroup,
}: ItemCPNProps) => {
    if (product) {
        const adminProductProps: AdminProductBlockProps = {
            ...product,
            onDelete,
            onClick,
        };
        return (
            <AdminProductBlockCPN
                {...adminProductProps}
                className={styles.productBlock}
            />
        );
    } else if (productGroup && onEditProduct) {
        const adminProductGroupProps: AdminProductGroupBlockProps = {
            ...productGroup,
            onDelete,
            onClick,
            onEditProduct
        };
        return (
            <AdminProductGroupBlockCPN
                {...adminProductGroupProps}
                className={styles.productBlock}
            />
        );
    } else {
        return null;
    }
};



/*************************
 * Helpers
 */

// check if product is Product or ProductGroup
const isProduct = (product: Product | ProductGroup): product is Product => {
    return (product as Product).price !== undefined;
}