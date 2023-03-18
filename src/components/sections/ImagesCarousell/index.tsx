import { Item } from "@/types/item";
import ImageCPN from "@/components/basics/ImageCPN";
import Carousell from "@/components/generics/Carousell";
import { ProductImage } from "@/types/product";
import styles from "@styles/sections/ImagesCarousellSection.module.scss";

import type {Props as ImageCPNProps} from "@/components/basics/ImageCPN";

export interface Props {
    images: ProductImage[];
    initialImageID?: string; 
}


export default function ImagesCarousellSection({images, initialImageID }: Props) {

    const items:(ImageCPNProps & Item)[] = images.map((image) => ({
        id: image.id,
        image,
        size: "medium",
        className: styles.image,
    }));

    return (
        <section className={styles.wrapper}>
            <Carousell 
                items = {items}
                initialItemID = {initialImageID?? items[0].id}
                ItemCPN = {ImageCPN}
                className = {styles.carousell} 
                mainItemClassName = {styles.mainItem}
                ulClassName = {styles.ul}
                liClassName = {styles.li}
            />
        </section>
    );
}

ImagesCarousellSection.displayName = "ImagesCarousellSection";