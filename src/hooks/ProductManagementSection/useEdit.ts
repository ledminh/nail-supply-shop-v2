import type { Product, ProductGroup } from '@/types/product';
import type { Dispatch, SetStateAction } from 'react';

import type { OpenEditProductProps } from '@/components/composites/ProductModal';
import type { OpenEditGroupProps } from '@/components/composites/ProductGroupModal';

import axios from 'axios';

import isProduct from '@/utils/isProduct';
import createFormData from '@/utils/createFormData';
import processImages from '@/utils/processImages';
import { Category } from '@/types/category';

type Props = {
    products: (Product|ProductGroup)[];
    currentCategory: Category | null;
    setProducts: Dispatch<SetStateAction<(Product | ProductGroup)[]>>
    openEditProduct: (props:OpenEditProductProps) => void;
    openEditGroup: (props: OpenEditGroupProps) => void;
}


function useEdit({products, currentCategory, setProducts, openEditProduct, openEditGroup}:Props) {



    const onEditProduct = ({productID, groupID}: {productID:string, groupID?:string}) => {
        let product: Product;

        if(groupID) {
            const group = products.find((product) => product.id === groupID);

            if (!group) {
                throw new Error("Group not found");
            }

            if(isProduct(group)) {
                throw new Error("Group is a product");
            }

            const _product = group.products.find((product) => product.id === productID);

            if(!_product) {
                throw new Error("Product not found");
            }

            product = _product;
        }
        else {
            const _product = products.find((product) => product.id === productID);

            if(!_product) {
                throw new Error("Product not found");
            }

            if(!isProduct(_product)) {
                throw new Error("Product is a group");
            }

            product = _product;
        }

        

        openEditProduct({
            product,
            onSave: ({serialNumber, name, intro, details, price, images}) => {
                const categoryID = currentCategory!.id;
                const formData = createFormData({serialNumber, categoryID, name, intro, details, price: price.toString()});

                if(groupID) {
                    formData.append('groupID', groupID);
                }
                
                processImages(images)
                    .then((images) => {
                        formData.append('images', JSON.stringify(images));
                        return axios.post('/api/products?type=update-product', formData);
                    })
                    .then(({data}) => {
                        if(!data.success) {
                            throw new Error(data.message);
                        }

                        if(groupID) {
                            const group = products.find((product) => product.id === groupID);

                            if (!group) {
                                throw new Error("Group not found");
                            }

                            if(isProduct(group)) {
                                throw new Error("Group is a product");
                            }

                            group.products = group.products.map((prod) => prod.id === data.product.id ? data.product : prod);

                            setProducts(products.map((prod) => prod.id === groupID ? group : prod));

                            return;
                        }
                        

                        setProducts(products.map((prod) => prod.id === data.product.id ? data.product : prod));
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

                async function editGroup() {
                    const uploadPromises = products.map((product) => processImages(product.images));

                    const processedImagesArr = await Promise.all(uploadPromises);
                    
                    const processedProducts = processedImagesArr.map((image, index) => ({
                        ...products[index],
                        images: image
                    }));

                    const categoryID = currentCategory!.id;

                    const formData = createFormData({name, categoryID, products: processedProducts});
                
                    const {data} = await axios.post('/api/products?type=update-group', formData);

                    if(!data.success) {
                        throw new Error(data.message);
                    }

                    setProducts(products.map((prod) => prod.id === data.product.id ? data.product : prod));
                }


                editGroup();
            }
        });
    }

    return {
        onEditProduct,
        onEditGroup
    }
}

export default useEdit;