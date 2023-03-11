import { FC } from "react";



import styles from "@styles/basics/ButtonCPN.module.scss";



export interface Props  {

};

type Button = FC<Props>;


const ButtonCPN:Button = ({}) => {


    return (
        <button>
            Button
        </button>
    );
}

export default ButtonCPN;

ButtonCPN.displayName = "ButtonCPN";