import styles from "@styles/composites/OrderSummary.module.scss";
import TableLayout from "@components/layouts/Table";
import { OrderedProduct } from "@/types/product";

export interface Props {
    orderedProducts: OrderedProduct[]
}


export default function OrderSummary({ orderedProducts}: Props) {

    const rows = orderedProducts.map(getRow);
    const footer = getFooter(orderedProducts);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Order Summary</h3>
            <TableLayout
                rows = {rows}
                footer = {footer}
                cellClassName = {styles.cell}
                rowClassName={styles.row}
            />
        </div>
    );
}

OrderSummary.displayName = "OrderSummary";



const getRow = (orderedProduct: OrderedProduct) => {

    return {
        key: orderedProduct.id,
        cells: [
            {
                key: 'name',
                value: orderedProduct.name + (orderedProduct.quantity > 1 ? " (x" + orderedProduct.quantity + ")" : "")
            },
            {
                key: 'dots',
                value: "............."  
            },
            {
                key: 'total',
                value: "$" + (orderedProduct.price * orderedProduct.quantity)
            }
        ]
    }    
}

const getFooter = (orderedProducts: OrderedProduct[]) => {
    return {
        key: 'footer',
        cells: [
            {
                key: 'empty',
                value: ''
            },
            {
                key: 'total_label',
                value: 'Total'
            },
            {
                key: 'total_value',
                value: "$" + orderedProducts.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) 
            }
        ]
    }
}