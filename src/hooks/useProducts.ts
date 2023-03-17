import { useEffect, useState } from 'react';
import { Product, ProductGroup } from '@/types/product';

type Props = {
    products: (Product|ProductGroup)[];
    categoryID: string;
    numProducts: number;
    productsPerPage: number;
}

const useProducts = ({products, categoryID, numProducts, productsPerPage}:Props) => {

    const [_products, setProducts] = useState<(Product|ProductGroup)[]>(products);
    const [isLoadMoreNeeded, setIsLoadMoreNeeded] = useState<boolean>(products.length < numProducts);

    useEffect(() => {
        setIsLoadMoreNeeded(products.length < numProducts);
    }, [products, numProducts]);

    const loadMore = () => {
        fetch('/api/products', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoryID,
                    productsPerPage,
                    offset: products.length,
                }),
            }
        ).then((res) => res.json())
        .then(({newProducts}) => {
            setProducts([...products, ...newProducts]);
        });
    }


    return {
        _products,
        setProducts,
        loadMore,
        isLoadMoreNeeded
    }
}

export default useProducts;