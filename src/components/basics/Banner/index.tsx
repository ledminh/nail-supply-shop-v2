import { FC } from "react";



import styles from "@styles/basics/BannerCPN.module.scss";



export interface Props  {
    text: string;
};

type Banner = FC<Props>;


const BannerCPN:Banner = ({text}) => {


    return (
        <div className={styles.wrapper}>
            <span className={styles.text}>
                {text}
            </span>
        </div>
    );
}

export default BannerCPN;

BannerCPN.displayName = "BannerCPN";