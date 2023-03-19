import { FC, ReactNode } from "react";
import { MouseEventHandler } from "react";


import styles from "@styles/basics/ButtonCPN.module.scss";



export interface Props  {
    type: "normal" | "attention" | "danger";
    onClick?: MouseEventHandler<HTMLButtonElement> ;
    icon?: {
        position: "left" | "right";
        Node: ReactNode;
    };
    label: string;
    className?: string;
    disabled?: boolean;
};

type Button = FC<Props>;


const ButtonCPN:Button = ({type, onClick, icon, label, className, disabled}) => {

    

    return (
        <button 
            className={styles.button + " " + (type === "normal" ? styles.normal : type === "attention" ? styles.attention : styles.danger) + (className? " " + className : "")}
            
            onClick={onClick}
            disabled={disabled}
            >
            {icon?.position === "left" && <span className={styles.icon}>{icon.Node}</span>}
            <span className={styles.label}>{label}</span>
            {icon?.position === "right" && <span className={styles.icon}>{icon.Node}</span>}
        </button>
    );
}

export default ButtonCPN;

ButtonCPN.displayName = "ButtonCPN";