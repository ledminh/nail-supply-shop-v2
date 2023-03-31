import { FC } from "react";

import {MouseEventHandler} from "react";

import axios from "axios";
import styles from "@styles/basics/StripeCheckoutButtonCPN.module.scss";
import getStripe from "@/utils/getStripejs";
import { OrderedProduct } from "@/types/product";


export interface Props  {
    orderedProducts: OrderedProduct[],
    email: string,
    disabled?: boolean,
};

type StripeCheckoutButton = FC<Props>;


const StripeCheckoutButtonCPN:StripeCheckoutButton = ({orderedProducts, email, disabled}) => {

    
    const onClick:MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        
        try {
            // Create a Checkout Session.
            const {data} = await axios.post('/api/checkout_sessions', { orderedProducts, email });


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
            disabled={disabled}
        >
            CHECK OUT (with Stripe)
        </button>
    );
}

export default StripeCheckoutButtonCPN;

StripeCheckoutButtonCPN.displayName = "StripeCheckoutButtonCPN";