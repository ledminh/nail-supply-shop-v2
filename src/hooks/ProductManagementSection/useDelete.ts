import axios from 'axios';

import getProductProps from '@utils/getProductProps';
import { Product, ProductGroup } from '@/types/product';

import { productManagementConfig } from '@/config';

type Props = {
    products: (Product | ProductGroup)[];
    setProducts: React.Dispatch<React.SetStateAction<(Product | ProductGroup)[]>>;
    setIsWarningModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setWarningMessage: React.Dispatch<React.SetStateAction<string>>;
    setToBeDeletedProductID: React.Dispatch<React.SetStateAction<string | null>>;
    setToBeDeletedProductGroupID: React.Dispatch<React.SetStateAction<string | null>>;
}

function useDelete ({
    products,
    setProducts,
    setIsWarningModalOpen,
    setWarningMessage,
    setToBeDeletedProductID,
    setToBeDeletedProductGroupID,
}:Props) {
    
    const { warningMessages } = productManagementConfig;

    const onDeleteProduct = (id: string) => {
        setToBeDeletedProductID(id);

        const productName = getProductProps({products, id, props: ['name']}).name?? '';

        setWarningMessage(warningMessages.deleteProduct(productName));
        setIsWarningModalOpen(true);
    }

    const onDeleteProductGroup = (id: string) => {
        setToBeDeletedProductGroupID(id);

        const productGroupName = getProductProps({products, id, props: ['name']}).name?? '';

        setWarningMessage(warningMessages.deleteProductGroup(productGroupName));
        setIsWarningModalOpen(true);
    }

    const deleteProduct = (productID: string) => {
        axios
            .post(`/api/products/?type=delete&productID=${productID}`)
            .then(({data} ) => {
                setProducts(data);
                setToBeDeletedProductID(null);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const deleteProductGroup = (productGroupID: string) => {
        axios
            .post(`/api/products/?type=delete&productGroupID=${productGroupID}`)
            .then(({data} ) => {
                setProducts(data);
                setToBeDeletedProductGroupID(null);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return {
        onDeleteProduct,
        onDeleteProductGroup,
        deleteProduct,
        deleteProductGroup,
    }
}

export default useDelete;