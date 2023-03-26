import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import axios from "axios";

import { useWarningModal, ShowWarningProps } from "@/components/composites/WarningModal";

import { useState, useEffect } from "react";
import AdminProductBlockCPN from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN from "@/components/basics/AdminProductGroupBlock";
import { useProductModal } from "@/components/composites/ProductModal";

import { ProductImage } from "@/types/product";

import useDelete from "@/hooks/ProductManagementSection/useDelete";

export interface Props {
}



export default function ProductManagementSection({  }: Props) {
    

    const [products, setProducts] = useState<(Product|ProductGroup)[]>([]);


    const {showWarning,  WarningModalComponent} = useWarningModal();

    const {onDeleteProduct, onDeleteGroup} = useDelete({products, setProducts, showWarning});    
    

    const {openEditProduct, ProductModalComponent} = useProductModal();

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
                
                const formData = createFormData({serialNumber, name, intro, details, price: price.toString()});
                
                processImages(images)
                    .then((images) => {
                        formData.append('images', JSON.stringify(images));
                        return axios.post('/api/products?type=update-product-single', formData);
                    })
                    .then((res) => res.data)
                    .then((data) => {
                        setProducts(products.map((prod) => prod.id === data.id ? data : prod));
                    });               
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
            <ProductModalComponent />
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




const processImages = async (images: (File | ProductImage)[]):Promise<ProductImage[]> => {
    // images can be File[], ProductImage[] or a mixture of both
    // if images are File[], upload them to server, get the filenames, and create ProductImage[]
    // if images are RemoteImage[], just return them

    const files = images.filter((image) => image instanceof File) as File[];
    const productImages = images.filter(
        (image) => !(image instanceof File)
    ) as ProductImage[];

    if (files.length === 0) {
        return Promise.resolve(productImages);
    } else {
        const res = await uploadProductImages(files);
        const filenames = res.data.filenames as string[];
        const newProductImages = filenames.map(
            (filename) => ({
                // generate a unique id string for each image with Date.now() and Math.random()
                id: `${Date.now()}-${Math.random()}`,
                src: `/images/product/${filename}`,
                alt: filename,
            })
        );
        return [...productImages, ...newProductImages];
    }

}

const uploadProductImages = (images: File[]) => {
    const imageFormData = new FormData();

    
    images.forEach((image) => {
        imageFormData.append('product-images', image);
    });

    return axios.post('/api/upload?type=product-images', imageFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
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
