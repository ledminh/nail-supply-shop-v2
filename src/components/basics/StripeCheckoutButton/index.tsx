import { FC } from "react";

import {MouseEventHandler} from "react";

import axios from "axios";
import styles from "@styles/basics/StripeCheckoutButtonCPN.module.scss";
import getStripe from "@/utils/getStripejs";


export interface Props  {
    amount: number;
};

type StripeCheckoutButton = FC<Props>;


const StripeCheckoutButtonCPN:StripeCheckoutButton = ({amount}) => {

    
    const onClick:MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        
        try {
            // Create a Checkout Session.
            const {data} = await axios.post('/api/checkout_sessions', { amount });


            // Redirect to Checkout.
            const stripe = await getStripe();
            

            const { error } = await stripe!.redirectToCheckout({sessionId: data.id});
            
            throw new Error(error?.message);
        }
        catch (error) {
            console.error(error);
        }
        
    };
    
    
    return (
        <button className={styles.wrapper}
            onClick={onClick}
        >
            Checkout
        </button>
    );
}

export default StripeCheckoutButtonCPN;

StripeCheckoutButtonCPN.displayName = "StripeCheckoutButtonCPN";