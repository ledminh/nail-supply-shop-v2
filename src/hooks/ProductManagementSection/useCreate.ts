import { Dispatch, SetStateAction } from "react";

import {Product, ProductGroup} from '@/types/product';
import { OpenCreateProductProps } from "@/components/composites/ProductModal";
import { OpenCreateGroupProps } from "@/components/composites/ProductGroupModal";

type Props = {
    products: (Product|ProductGroup)[],
    setProducts: Dispatch<SetStateAction<(Product|ProductGroup)[]>>,
    openCreateProduct: (props: OpenCreateProductProps) => void,
    openCreateGroup: (props:OpenCreateGroupProps) => void
}



export default function useCreate({
    products, setProducts, openCreateProduct, openCreateGroup
}:Props) {



    const createProduct = () => {}
    const createGroup = () => {}


    return {
        createProduct,
        createGroup
    }
}