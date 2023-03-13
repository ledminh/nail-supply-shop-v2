import { FC } from "react";
import { MouseEventHandler } from "react";


import styles from "@styles/basics/ButtonCPN.module.scss";



export interface Props  {
    type: "normal" | "attention" | "danger";
    onClick?: MouseEventHandler<HTMLButtonElement> ;
    icon?: {
        position: "left" | "right";
        node: JSX.Element;
    };
    label: string;
    className?: string;
};

type Button = FC<Props>;


const ButtonCPN:Button = ({type, onClick, icon, label, className}) => {


    return (
        <button className={type === "normal" ? styles.normal : type === "attention" ? styles.attention : styles.danger + (className? " " + className : "")}
            onClick={onClick}>
            {icon?.position === "left" && <span className={styles.icon}>icon.node</span>}
            <span className={styles.label}>{label}</span>
            {icon?.position === "right" && <span className={styles.icon}>icon.node</span>}
        </button>
    );
}

export default ButtonCPN;

ButtonCPN.displayName = "ButtonCPN";