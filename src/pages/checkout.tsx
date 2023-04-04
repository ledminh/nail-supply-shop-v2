import { ContactInfo } from '@/types/others';
import { ShippingAddress } from '@/types/order';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Checkout.module.scss'
import StripeCheckoutButtonCPN from '@/components/basics/StripeCheckoutButton';
import OrderDetail from '@/components/composites/OrderDetail';
import ShippingAddressForm from '@/components/composites/ShippingAddressForm';

import Link from 'next/link';

import { useState, useEffect } from 'react';

import { getAboutUsData } from '@/database';


export interface Props {
  errorMessage?: string,
  contactInfo: ContactInfo,
  aboutUsFooter: string,
};

export default function Checkout({errorMessage, contactInfo, aboutUsFooter }:Props) {

  if(errorMessage) {
    throw new Error(errorMessage);
  }

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null); 
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState<boolean>(true);
  

  useEffect(() => {
    if (isValidShippingAddress(shippingAddress) && orderedProducts.length > 0) {
      setIsCheckoutDisabled(false);
    }
    else {
      setIsCheckoutDisabled(true);
    }
  }, [shippingAddress])
  
  
  const onShippingAddressChange = (shippingAddress:ShippingAddress) => {
    setShippingAddress(shippingAddress);
  }




  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutUsFooter}
    >
      <div className={styles.wrapper}>
        <section className={styles.header}>
          <h2 className={styles.title}>Checkout</h2>
          <Link className={styles.editCart} href="/cart">Edit Cart</Link>
        </section>
        <section className={styles.orderDetail}>
          <OrderDetail orderedProducts={orderedProducts}/>
        </section>
        <section className={styles.payment}>
          <h3 className={styles.paymentTitle}>Payment</h3>
          <ShippingAddressForm 
            onChange={onShippingAddressChange}
          />
          <StripeCheckoutButtonCPN orderedProducts={orderedProducts} email={shippingAddress?.email} disabled={isCheckoutDisabled}/>  
        </section>
      </div>
    </PageLayout>
  )
}

Checkout.displayName = "Checkout";

const orderedProducts = [
  {
    id: "1",
    name: "Nail Essential 1",
    price: 10,
    quantity: 1,
    image: {
      src: "/images/placeholder_1.png",
      alt: "Nail Essential 1"
    }
  },
  {
    id: "2",
    name: "Nail Essential 2",
    price: 20,
    quantity: 2,
    image: {
      src: "/images/placeholder_2.png",
      alt: "Nail Essential 2"
    }
  },
  {
    id: "3",
    name: "Nail Essential 3",
    price: 30,
    quantity: 3,
    image: {
      src: "/images/placeholder_3.png",
      alt: "Nail Essential 3"
    }
  },
  {
    id: "4",
    name: "Nail Essential 4",
    price: 40,
    quantity: 4,
    image: {
      src: "/images/placeholder_4.png",
      alt: "Nail Essential 4"
    }
  },
]


export const getServerSideProps = async () => {
  
  try {
    const aboutUsRes = await getAboutUsData();

    if(!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message
        }
      }
    }

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    
    return {
      props: {
        contactInfo,
        aboutUsFooter,
      }
    }
  }
  catch (err:any) {
    return {
      props: {
        errorMessage: err.message
      }
    }
  }



}


/*****************************
 * Function helpers
 */

function isValidShippingAddress(shippingAddress:ShippingAddress | null):boolean {
  if (!shippingAddress) {
    return false;
  }
  
  const {name, address1, city, state, zip, email} = shippingAddress;
  
  if (!name || !address1 || !city || !state || !zip || !email) {
    return false;
  }


  return true;
}


