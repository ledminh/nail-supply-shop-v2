import axios from 'axios';

import { Product, ProductGroup } from '@/types/product';

import { productManagementConfig } from '@/config';

import { ShowWarningProps } from '@/components/composites/WarningModal';

type useDeleteProps = {
    products: (Product|ProductGroup)[];
    showWarning: (warningProps: ShowWarningProps) => void;
    setReloadProducts: React.Dispatch<React.SetStateAction<boolean>>;
}

function useDelete ({products, showWarning, setReloadProducts}:useDeleteProps) {
    const {warningMessages} = productManagementConfig;



    const post = (url: string) => {
        axios.post(url)
            .then(({data}) => {
                if(data.success)
                    setReloadProducts(true);
                else {
                    throw new Error(data.message);
                }
            })
            .catch((err) => {
                throw new Error(err.message);
            });
    }


    /*******************************
     * Public functions
     */



    const onDeleteProduct = (productID: string) => {
        const productName = products.find((product) => product.id === productID)?.name;

        if(!productName) {
            throw new Error("Product not found");
        }

        showWarning({
            message: warningMessages.deleteProduct(productName),
            onOK: () => {
                post(`/api/products/?type=delete-single-product&id=${productID}`);
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
                post(`/api/products/?type=delete-group&id=${groupID}`);                
            },
            
        })

    }

    return {
        onDeleteProduct,
        onDeleteGroup
    }
}

export default useDelete;