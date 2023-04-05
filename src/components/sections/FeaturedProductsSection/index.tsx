import FeaturedProductGroup from "@/components/composites/FeaturedProductGroup";
import List from "@/components/generics/List";
import styles from "@styles/sections/FeaturedProductsSection.module.scss";

import type {Props as FeaturedProductGroupProps} from "@components/composites/FeaturedProductGroup"; 

export interface Props {
    featuredProductGroups: FeaturedProductGroupProps[];
}


export default function FeaturedProductsSection({ featuredProductGroups }: Props) {

    const items = featuredProductGroups.map((group) => {
        return ({
            id: group.title,
            ...group
        });
    });


    return (
        <section className={styles.wrapper}>
            <List 
                items = {items}
                ItemCPN = {FeaturedProductGroup}
                liClass = {styles.li} 
                ulClass = {styles.ul}
                horizontal
            /> 
        </section>
    );
}

FeaturedProductsSection.displayName = "FeaturedProductsSection";