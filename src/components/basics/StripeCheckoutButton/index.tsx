import { FC, useState, useEffect } from "react";

import { MouseEventHandler } from "react";

import axios from "axios";
import styles from "@styles/basics/StripeCheckoutButtonCPN.module.scss";
import getStripe from "@/utils/getStripejs";
import { OrderedProduct } from "@/types/product";
import { ShippingAddress } from "@/types/order";


export interface Props {
  orderedProducts: OrderedProduct[];
  shippingAddress: ShippingAddress;
  disabled?: boolean;
}

type StripeCheckoutButton = FC<Props>;

const StripeCheckoutButtonCPN: StripeCheckoutButton = ({
  orderedProducts,
  shippingAddress,
  disabled,
}) => {

  const [isDisabled, setIsDisabled] = useState<boolean>(disabled? disabled : true);

  useEffect(() => {
    if (disabled) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }

  }, [disabled]);


  const onClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      // Create a Checkout Session.
      const { data } = await axios.post("/api/checkout_sessions", {
        orderedProducts,
        shippingAddress,
      });

      // Redirect to Checkout.
      const stripe = await getStripe();

      const res = await stripe!.redirectToCheckout({ sessionId: data.id });

      if (res.error) {
        throw new Error(res.error?.message);
      }



    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button className={styles.wrapper} onClick={onClick} disabled={isDisabled}>
      CHECK OUT (with Stripe)
    </button>
  );
};

export default StripeCheckoutButtonCPN;

StripeCheckoutButtonCPN.displayName = "StripeCheckoutButtonCPN";


