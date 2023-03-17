import { useState } from 'react';
import { Product, ProductGroup } from '@/types/product';

type Props = {
    products: (Product|ProductGroup)[];
}

const useProducts = ({products}:Props) => {

    const [_products, setProducts] = useState<(Product|ProductGroup)[]>(products);


    const loadMore = () => {
        console.log('load more');
    }


    return {
        _products,
        setProducts,
        loadMore
    }
}

export default useProducts;