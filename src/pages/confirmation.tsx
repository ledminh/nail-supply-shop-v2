import { ContactInfo } from '@/types/others';

import { Order } from '@/types/order';

import {useEffect} from 'react';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Confirmation.module.scss'

import { saveOrder, deleteTempOrder } from '@/database';

import ShippingAddressCPN from '@/components/basics/ShippingAddress';
import OrderSummary from '@/components/composites/OrderSummary';

import Link from 'next/link';
import { getAboutUsData } from '@/database';

import { useCart } from '@/contexts/CartContext';

import { GetServerSideProps } from 'next';

import {getTempOrder} from '@/database';


export interface Props {
  errorMessage?: string,
  contactInfo: ContactInfo,
  aboutUsFooter: string,
  order: Order  
};

export default function Confirmation({errorMessage, contactInfo, aboutUsFooter, order }:Props) {

  if(errorMessage) {
    throw new Error(errorMessage);
  }

  const {clearCart} = useCart();

  useEffect(() => {
    clearCart();
  }, []);


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutUsFooter}
    >
      <div className={styles.wrapper}>
        <section className={styles.header}>
          <h2 className={styles.title}>ORDER CONFIRMATION</h2>
          <h3 className={styles.orderNumber}>
            Order Number: <span className={styles.value}>{order.id}</span>
          </h3>
        </section>
        <section className={styles.shippingAddress}>
          <p>Thank you for your purchase!</p>
          <p>Your order has been confirmed and will be shipped to the following address:</p>
          <ShippingAddressCPN shippingAddress={order.shippingAddress}/>
        </section>
        <section className={styles.orderSummary}>
          <OrderSummary orderedProducts={order.orderedProducts}/>
        </section>
        <section className={styles.text}>
          <p>A confirmation email has been sent to <span className={styles.email}>{order.shippingAddress.email}</span>.</p>
          <p>You can check the status of your order <Link href={'/order/' + order.id} className={styles.linkToOrderPage}>HERE</Link></p>
          <p>Please remember your order number to contact our customer service by email at {contactInfo.email}, or by phone at {contactInfo.phone}.</p>
          <p>Thank you for choosing Nail Essential for all of your nail care needs!</p>
        </section>
      </div>
    </PageLayout>
  )
}

Confirmation.displayName = "Confirmation";



export const getServerSideProps:GetServerSideProps = async (context) => {

  const {temp_id} = context.query;

  if(typeof temp_id !== 'string') {
    return {
      props: {
        errorMessage: 'Invalid confirmation id'
      }
    }
  }

  
  try {
    const [aboutUsRes, orderRes] = await Promise.all([getAboutUsData(), getTempOrder(temp_id)]);

    if(!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message
        }
      }
    }

    if(!orderRes.success) {
      return {
        props: {
          errorMessage: orderRes.message
        }
      }
    }

 
    const newOrder = {
      ...orderRes.data!,
      id: randomId(20)
    }
    

    const resSave = await saveOrder(newOrder);
    const resDelete = await deleteTempOrder(temp_id);


    if(!resSave.success) {
      return {
        props: {
          errorMessage: resSave.message
        }
      }
    }

    if(!resDelete.success) {
      return {
        props: {
          errorMessage: resDelete.message
        }
      }
    }


    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
 

    return {
      props: {
        contactInfo,
        aboutUsFooter,
        order: newOrder
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


/******************************
 * Helper functions
 */

// random id generator with params for length and prefix
export function randomId(length = 10, prefix = '') {
  return prefix + Math.random().toString(36).substring(2, length + 2);
}

