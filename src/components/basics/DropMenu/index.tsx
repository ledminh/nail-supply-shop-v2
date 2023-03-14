import { FC } from "react";



import styles from "@styles/basics/DropMenuCPN.module.scss";



export interface Props  {

};

type DropMenu = FC<Props>;


const DropMenuCPN:DropMenu = ({}) => {


    return (
        <div className={styles.wrapper}>
            
        </div>
    );
}

export default DropMenuCPN;

DropMenuCPN.displayName = "DropMenuCPN";