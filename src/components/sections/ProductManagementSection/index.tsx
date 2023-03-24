import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";

import { Product, ProductGroup } from "@/types/product";
import {useState, useEffect} from "react";

import WarningModal from "@/components/composites/WarningModal";

import { ProductApiResponse } from "@/pages/api/products";

import axios, { AxiosResponse } from "axios";

import { RemoteImage } from "@/types/image";

import getProductProps from "@/utils/getProductProps";

import ProductModal from "@/components/composites/ProductModal";

import AdminProductBlockCPN, {Props as AdminProductBlockProps} from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN, {Props as AdminProductGroupBlockProps} from "@/components/basics/AdminProductGroupBlock";
import useDelete from "@/hooks/ProductManagementSection/useDelete";

export interface Props {
}


export default function ProductManagementSection({  }: Props) {

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState<string>('');

    const [toBeDeletedProductID, setToBeDeletedProductID] = useState<string | null>(null);
    const [toBeDeletedProductGroupID, setToBeDeletedProductGroupID] = useState<string | null>(null);

    const [productModalType, setProductModalType] = useState<'create' | 'edit'|null>(null);

    const [beingEditedProduct, setBeingEditedProduct] = useState<Product | null>(null);

    const { onDeleteProduct, onDeleteProductGroup, deleteProduct, deleteProductGroup } =  useDelete({ products, setProducts,         setIsWarningModalOpen, setWarningMessage, setToBeDeletedProductID,setToBeDeletedProductGroupID});


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
     * Functions for ProductModal
     */
    

    const onEditProduct = (prodID: string) => {
        setProductModalType('edit');
        setBeingEditedProduct(products.find((prod) => prod.id === prodID) as Product);
        setIsProductModalOpen(true);
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

    const updateProduct = (id: string, serialNumber:string,name :string, intro:string, details:string, price:number, images: (RemoteImage|File)[]) => {

        const formData = createFormData({
            id,
            serialNumber,
            name,
            intro,
            details,
            price,
        });

        // if images contains a File --> user changed the image
        if(images.some((image) => image instanceof File)) {
            // Upload new images
            uploadProductImages(images)
            .then((res) => res.data)
            .then((imageData) => {
                const { filenames } = imageData;
                let iFileName = 0;
                
                const updatedImages: (RemoteImage|string)[] = [];
                
                for(let i = 0; i < images.length; i++) {
                    const curImage = images[i];
                    if(curImage instanceof File) {
                        updatedImages.push(filenames[iFileName++]);
                    }
                    else {
                        updatedImages.push(curImage);
                    }
                }
                
                formData.append('images', JSON.stringify(updatedImages));

                return axios.post('/api/products?type=update', formData);
            })
            .then((res) => res.data)
            .then((updatedProduct) => {
                // Update the product list (assuming you have a setProducts function and products state)
                setProducts(products.map((product) => product.id === id ? updatedProduct : product));
            })
            .catch((err) => {
                console.error(err);
            });
        } else {
            axios.post('/api/products?type=update', formData)
                .then((res) => res.data)
                .then((updatedProduct) => {
                    setProducts(products.map((product) => product.id === id ? updatedProduct : product));
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const convertToProductItem = (product: Product | ProductGroup) => {
        if(isProduct(product)){ // product is a Product
            return {
                id: product.id,
                onDelete: onDeleteProduct,
                onClick: onEditProduct,
                product
            }
        }
        else { // product is a ProductGroup
            return {
                id: product.id,
                onDelete: onDeleteProductGroup,
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
            {
                isProductModalOpen &&  (
                    productModalType === 'edit'?
                        <ProductModal type='edit' 
                        onSave={({serialNumber, name, intro, details, price, images}) => {
                            updateProduct(beingEditedProduct!.id, serialNumber,name, intro, details, price, images);
                            setIsProductModalOpen(false);
                            setProductModalType(null);
                            setBeingEditedProduct(null);
                        }} 
                        onCancel={() => {
                            setIsProductModalOpen(false);
                            setProductModalType(null);
                            setBeingEditedProduct(null);
                        }}
                        initName = {beingEditedProduct?.name || ''} 
                        initIntro = {beingEditedProduct?.intro || ''}
                        initDetails = {beingEditedProduct?.details || ''}
                        initPrice = {beingEditedProduct?.price || 0}
                        initSerialNumber = {beingEditedProduct?.id || ''} 
                        initImages = {beingEditedProduct?.images || []} 
                        /> : null
                    // <ProductModal type='create' 
                    //     onSave={({name, description, image}) => {
                            
                    //         createNewCategory(name, description, image as File);
                    //         setIsCategoryModalOpen(false);
                    //         setCategoryModalType(null);
                    //     }} 
                    //     onCancel={() => {
                    //         setIsCategoryModalOpen(false);
                    //         setCategoryModalType(null);
                    //     }}
                    //     /> : 
)
            }
            {
                isWarningModalOpen && (
                    <WarningModal message={warningMessage}
                        onOK={() => {
                            if(toBeDeletedProductID)
                                deleteProduct(toBeDeletedProductID);
                            else if(toBeDeletedProductGroupID)
                                deleteProductGroup(toBeDeletedProductGroupID);

                            setIsWarningModalOpen(false);
                        }} 
                        onCancel={() => {
                            setToBeDeletedProductID(null);
                            setIsWarningModalOpen(false);
                        }}
                        />)
            }
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


function createFormData(obj: any) {
    const formData = new FormData();

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            formData.append(key, obj[key].toString());
        }
    }

    return formData;
}


const uploadProductImages = (images: (File | RemoteImage)[]) => {
    const imageFormData = new FormData();

    
    images.forEach((image) => {
        if (image instanceof File) {
            imageFormData.append('product-images', image);
        }
    });

    return axios.post('/api/upload?type=product-images', imageFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}


