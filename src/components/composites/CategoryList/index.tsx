import styles from "@styles/composites/CategoryList.module.scss";
import  LinksList  from '@/components/generics/LinksList';

import CategoryBlockCPN from '@/components/basics/CategoryBlockCPN';

import { Category } from '@/types/category';
import { LinkItem } from "@/types/item";

export interface Props {
    categories: Category[];
    detailed?: boolean;
    vertical?: boolean;
}

type Item = Category & LinkItem;

export default function CategoryList({ categories, detailed, vertical }: Props) {
    const items:Item[] = categories.map((category) => {
        return {
            ...category,
            path: `/categories/${category.slug}`
        }
    })

    if(detailed) {
        const CategoryBlockDetailed = (props:Item) => (
            <CategoryBlockCPN {...props} detailed />
        )
    

        return (
            <LinksList 
                items = {items}
                ItemCPN = {CategoryBlockDetailed}
                liClass = {styles.li + " " + styles.detailed} 
                ulClass = {styles.ul + " " + styles.detailed}
                linkClass = {styles.link + " " + styles.detailed}
            />
        );
    }

    if(vertical) {
        const CategoryBlockVertical = (props:Item) => (
            <CategoryBlockCPN {...props} vertical />
        )

        return (
            <LinksList
                items = {items}
                ItemCPN = {CategoryBlockVertical}
                liClass = {styles.li + " " + styles.vertical}
                ulClass = {styles.ul + " " + styles.vertical}
                linkClass = {styles.link + " " + styles.vertical}
            />
        );
    }

    return (
        <LinksList 
            items = {items}
            ItemCPN = {CategoryBlockCPN}
            liClass = {styles.li} 
            ulClass = {styles.ul}
            linkClass = {styles.link}
        />
    );
}

CategoryList.displayName = "CategoryList";


