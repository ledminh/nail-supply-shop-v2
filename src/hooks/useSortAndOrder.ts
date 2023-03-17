import { NextRouter, useRouter } from 'next/router';
import { ListCondition } from '@/types/list-conditions';
import { SortItem, SortedOrderItem } from '@/types/list-conditions';
import { Product, ProductGroup } from '@/types/product';


type Props = {
    setProducts: (products: (Product|ProductGroup)[]) => void;
    categoryID: string;
    productsPerPage: number;
}
const useSortAndOrder = ({setProducts, categoryID, productsPerPage}:Props) => {
    const router = useRouter();

    const sortAndOrderOnChange = (condition: ListCondition) => {
        const { sort, sortedOrder } = condition;

        if (sort && sortedOrder) {
            fetch('/api/products', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        categoryID,
                        sort: sort.value,
                        sortedOrder: sortedOrder.value,
                        productsPerPage
                    }),
                }
            ).then((res) => res.json())
            .then(({products}) => {
                setProducts(products);
                // Change the URL without reloading the page
                changeURL(sort, sortedOrder, router);
            });


        }
    };

    return {
        sortAndOrderOnChange,
    };
};

export default useSortAndOrder;



const changeURL = (sort:SortItem, sortedOrder:SortedOrderItem, router:NextRouter) => {
    

    router.push(
        {
        pathname: router.pathname,
        query: {
            ...router.query,
            sort: sort.value,
            sortedOrder: sortedOrder.value,
        },
        },
        undefined,
        { shallow: true },
    );
}
    
