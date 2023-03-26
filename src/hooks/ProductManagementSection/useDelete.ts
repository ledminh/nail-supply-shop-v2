import axios from 'axios';

import { Product, ProductGroup } from '@/types/product';

import { productManagementConfig } from '@/config';

import { ShowWarningProps } from '@/components/composites/WarningModal';

type useDeleteProps = {
    products: (Product|ProductGroup)[];
    setProducts: React.Dispatch<React.SetStateAction<(Product|ProductGroup)[]>>;
    showWarning: (warningProps: ShowWarningProps) => void;
}

function useDelete ({products, setProducts, showWarning}:useDeleteProps) {
    const {warningMessages} = productManagementConfig;


    const onDeleteProduct = (productID: string) => {
        const productName = products.find((product) => product.id === productID)?.name;

        if(!productName) {
            throw new Error("Product not found");
        }

        showWarning({
            message: warningMessages.deleteProduct(productName),
            onOK: () => {
                axios.post(`/api/products/?type=delete-single-product&id=${productID}`)
                .then(({data}) => {
                    setProducts(data);
                })
                .catch((err) => {
                    console.error(err);
                });
            },
            
        })
        
    }

    const onDeleteGroup = (groupID: string) => {
        const groupName = products.find((product) => product.id === groupID)?.name;

        if(!groupName) {
            throw new Error("Group not found");
        }

        showWarning({
            message: warningMessages.deleteGroup(groupName),
            onOK: () => {
                axios.post(`/api/products/?type=delete-group&id=${groupID}`)
                .then(({data}) => {
                    setProducts(data);
                })
                .catch((err) => {
                    console.error(err);
                });
            },
            
        })

    }

    return {
        onDeleteProduct,
        onDeleteGroup
    }
}

export default useDelete;