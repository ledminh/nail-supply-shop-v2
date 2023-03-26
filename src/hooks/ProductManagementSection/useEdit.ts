import type { Product, ProductGroup } from '@/types/product';
import type { Dispatch, SetStateAction } from 'react';

import type { OpenEditProductProps } from '@/components/composites/ProductModal';
import type { OpenEditGroupProps } from '@/components/composites/ProductGroupModal';

import axios from 'axios';

import isProduct from '@/utils/isProduct';
import createFormData from '@/utils/createFormData';
import processImages from '@/utils/processImages';

type Props = {
    products: (Product|ProductGroup)[];
    setProducts: Dispatch<SetStateAction<(Product | ProductGroup)[]>>
    openEditProduct: (props:OpenEditProductProps) => void;
    openEditGroup: (props: OpenEditGroupProps) => void;
}


function useEdit({products, setProducts, openEditProduct, openEditGroup}:Props) {



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

    const onEditGroup = (groupID: string) => {
        const group = products.find((product) => product.id === groupID);

        if (!group) {
            throw new Error("Group not found");
        }

        if(isProduct(group)) {
            throw new Error("Group is a product");
        }


        openEditGroup({
            productGroup: group,
            onSave: ({name, products}) => {

                const formData = createFormData({name});

                const imagePromises = products.map((product) => ({
                    productID: product.id,
                    promise: processImages(product.images)
                }));


                Promise.all(imagePromises.map((imagePromise) => imagePromise.promise))
                    .then((images) => {
                        formData.append('products', JSON.stringify(imagePromises.map((imagePromise, index) => {
                            
                            const product = products.find((prod) => prod.id === imagePromise.productID);


                            return {
                                ...product,
                                id: imagePromise.productID,
                                images: images[index]
                            }
                        })));
                
                        axios.post('/api/products?type=update-product-group', formData)
                            .then((res) => res.data)
                            .then((data) => {
                                setProducts(products.map((prod) => prod.id === data.id ? data : prod));

                            });
                    })
            }
        });
    }

    return {
        onEditProduct,
        onEditGroup
    }
}

export default useEdit;