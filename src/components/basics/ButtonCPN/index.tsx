import { FC } from "react";



import styles from "@styles/basics/ButtonCPN.module.scss";



export interface Props  {

};

type Button = FC<Props>;


const ButtonCPN:Button = ({}) => {


    return (
        <div className={styles.placeholder}>
            Button component
        </div>
    );
}

export default ButtonCPN;

ButtonCPN.displayName = "ButtonCPN";