import { FC } from "react";



import styles from "@styles/basics/CategoryBlockCPN.module.scss";
import  ImageCPN  from '@/components/basics/ImageCPN';
import { RemoteImage } from '@/types/image';



export interface Props  {
    image: RemoteImage;
    name: string;
    description: string
    detailed?: boolean;
};

type CategoryBlock = FC<Props>;


const CategoryBlockCPN:CategoryBlock = ({image, name, description, detailed}) => {

    if(!detailed) {
        return (
            <div className={styles.wrapper}>
                <ImageCPN
                    image={image}
                    size="medium"
                    className={styles.image}
                    />
                <div className={styles.text}>
                    <h4 className={styles.name}>{name}</h4>
                </div>    
            </div>
        );
    } 

    return (
        <div className={styles.wrapper + ' ' + styles.detailed}>
            <ImageCPN
                image={image}
                size="medium"
                className={styles.image}
                />
            <div className={styles.text}>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.description}>{description}</p>
            </div>    
        </div>
    );
}

export default CategoryBlockCPN;

CategoryBlockCPN.displayName = "CategoryBlockCPN";