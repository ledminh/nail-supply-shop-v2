import { ContactInfo } from "@/types/others";
import { ShippingAddress } from "@/types/order";

import PageLayout from "@/components/layouts/PageLayout";

import styles from "@/styles/pages/Checkout.module.scss";
import StripeCheckoutButtonCPN from "@/components/basics/StripeCheckoutButton";
import OrderDetail from "@/components/composites/OrderDetail";
import ShippingAddressForm from "@/components/composites/ShippingAddressForm";

import Link from "next/link";

import { useState, useEffect } from "react";

import { getAboutUsData } from "@/database";
import { useCart } from "@/contexts/CartContext";

export interface Props {
  errorMessage?: string;
  contactInfo: ContactInfo;
  aboutUsFooter: string;
}

export default function Checkout({
  errorMessage,
  contactInfo,
  aboutUsFooter,
}: Props) {
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (isValidShippingAddress(shippingAddress) && cart.length > 0) {
      setIsCheckoutDisabled(false);
    } else {
      setIsCheckoutDisabled(true);
    }
  }, [shippingAddress]);

  const onShippingAddressChange = (shippingAddress: ShippingAddress) => {
    setShippingAddress(shippingAddress);
  };

  const { cart } = useCart();

  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <div className={styles.wrapper}>
        <section className={styles.header}>
          <h2 className={styles.title}>Checkout</h2>
          {cart.length > 0 && (
            <Link className={styles.editCart} href="/cart">
              Edit Cart
            </Link>
          )}
        </section>
        {cart.length === 0 && (
          <div className={styles.emptyCart}>
            <h3 className={styles.emptyCartTitle}>Your cart is empty</h3>
            <Link href="/shop" className={styles.link}>
              Go back to shopping.
            </Link>
          </div>
        )}
        {cart.length > 0 && (
          <>
            <section className={styles.orderDetail}>
              <OrderDetail orderedProducts={cart} />
            </section>
            <section className={styles.payment}>
              <h3 className={styles.paymentTitle}>Payment</h3>
              <ShippingAddressForm onChange={onShippingAddressChange} />
              <StripeCheckoutButtonCPN
                orderedProducts={cart}
                shippingAddress={shippingAddress!}
                disabled={isCheckoutDisabled}
              />
            </section>
          </>
        )}
      </div>
    </PageLayout>
  );
}

Checkout.displayName = "Checkout";

export const getServerSideProps = async () => {
  try {
    const aboutUsRes = await getAboutUsData();

    if (!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message,
        },
      };
    }

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;

    return {
      props: {
        contactInfo,
        aboutUsFooter,
      },
    };
  } catch (err: any) {
    return {
      props: {
        errorMessage: err.message,
      },
    };
  }
};

/*****************************
 * Function helpers
 */

function isValidShippingAddress(
  shippingAddress: ShippingAddress | null
): boolean {
  if (!shippingAddress) {
    return false;
  }

  const { name, address1, city, state, zip, email } = shippingAddress;

  if (!name || !address1 || !city || !state || !zip || !isValidEmail(email)) {
    return false;
  }

  return true;
}

// check if email is valid
function isValidEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
