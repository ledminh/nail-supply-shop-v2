import { Dispatch, SetStateAction } from "react";

import {Product, ProductGroup} from '@/types/product';
import { OpenCreateProductProps } from "@/components/composites/ProductModal";
import { OpenCreateGroupProps } from "@/components/composites/ProductGroupModal";
import createFormData from "@/utils/createFormData";

import processImages from "@/utils/processImages";

import axios from 'axios';


type Props = {
    products: (Product|ProductGroup)[],
    setProducts: Dispatch<SetStateAction<(Product|ProductGroup)[]>>,
    openCreateProduct: (props: OpenCreateProductProps) => void,
    openCreateGroup: (props:OpenCreateGroupProps) => void
}



export default function useCreate({
    products, setProducts, openCreateProduct, openCreateGroup
}:Props) {



    const createProduct = () => {
        openCreateProduct({
            onSave({serialNumber, name, intro, details, price, images}) {

                async function createProduct() {
                    const processedImages = await processImages(images);

                    const formData = createFormData({serialNumber, name, intro, details, price, images: processedImages});

                    const res = await axios.post('/api/products?type=create', formData);

                    setProducts([res.data.product, ...products ]);
                }

                createProduct();
            }
        })
    }
    
    const createGroup = () => {
        openCreateGroup({
            onSave({name, products}) {
                async function createGroup() {
                            

                    const res = await axios.post('/api/groups?type=create', {
                        name,
                        products
                    });

                    setProducts([res.data.group, ...products]);
                }

                createGroup();
            }
        })
    }


    return {
        createProduct,
        createGroup
    }
}