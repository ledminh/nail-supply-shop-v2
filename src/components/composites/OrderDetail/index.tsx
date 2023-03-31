import TableLayout from "@/components/layouts/Table";
import { OrderedProduct } from "@/types/product";
import styles from "@styles/composites/OrderDetail.module.scss";


export interface Props {
    orderedProducts: OrderedProduct[]
}


export default function OrderDetail({ orderedProducts}: Props) {

    const rows = orderedProducts.map(getRow);

    const footer = getFooter(orderedProducts);

    return (
        <div className={styles.wrapper}>
            <h3>Order Detail</h3>
            <TableLayout
                header = {header}
                rows = {rows}
                footer = {footer}
            />
        </div>
    );
}

OrderDetail.displayName = "OrderDetail";


const header = {
    key: 'header',
    cells: [
        {
            key: 'empty',
            value: ''
        },
        {
            key: 'price',
            value: 'Price'
        },
        {
            key: 'quantity',
            value: 'Quantity'
        },
        {
            key: 'total',
            value: 'Total'
        }
    ]
};


const getRow = (orderedProducts: OrderedProduct) => {

    return {
        key: orderedProducts.id,
        cells: [
            {
                key: 'name',
                value: orderedProducts.name
            },
            {
                key: 'price',
                value: "$" + orderedProducts.price 
            },
            {
                key: 'quantity',
                value: "$"+ orderedProducts.quantity
            },
            {
                key: 'total',
                value: "$" + (orderedProducts.price * orderedProducts.quantity)
            }
        ]
    }    
}

const getFooter = (orderedProducts: OrderedProduct[]) => {
    return {
        key: 'footer',
        cells: [
            {
                key: 'empty_1',
                value: ''
            },
            {
                key: 'empty_2',
                value: ''
            },
            {
                key: 'total',
                value: 'Total'
            },
            {
                key: 'total',
                value: orderedProducts.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) + ""
            }
        ]
    }
}