import Select from "@/components/generics/Select";
import { Product } from "@/types/product";
import styles from "@styles/composites/ProductInfo.module.scss";
import { convertToOptionItem } from "@/components/generics/Select";
import { NextRouter } from "next/router";

export interface Props {
    name: string;
    intro: string;
    groupName?: string;
    otherProducts?: Product[];
    router: NextRouter;
    className?: string;
}


export default function ProductInfo({ name, intro, groupName, otherProducts, router, className }: Props) {

    const optionItems = otherProducts?.map(convertProductToOptionItem);
    const classNames = className ? `${styles.wrapper} ${className}` : styles.wrapper;
    
    return (
        <div className={classNames}>
            <h2 className={styles.name}>{name}</h2>
            {groupName && <h3 className={styles.groupName}>{groupName}</h3>}
            {
                otherProducts && otherProducts.length > 0 && (
                    <div className={styles.otherProducts}>
                        <span>Other products in this group:</span>
                        <Select 
                            selectClass = {styles.select}
                            optionClass = {styles.option}
                            optionItems = {optionItems?? []} 
                            initOptionItem = {optionItems?.[0]}
                            onChange = {(selectedProduct) => {
                                router.push(`/product/${selectedProduct.id}`);
                            }}
                        />
                    </div>
                    )
            }
            <p className={styles.intro}>{intro}</p>
        </div>
    );
}

ProductInfo.displayName = "ProductInfo";

const getValue = (p:Product) => p.id;
const getLabel = (p:Product) => p.name;     


const convertProductToOptionItem = (product: Product) => {
   
    return convertToOptionItem({item: product, getValue, getLabel});
}