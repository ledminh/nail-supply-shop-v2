import { ContactInfo } from '@/types/others';

import { Order, ShippingAddress } from '@/types/order';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Confirmation.module.scss'


import ShippingAddressCPN from '@/components/basics/ShippingAddress';
import OrderSummary from '@/components/composites/OrderSummary';

import Link from 'next/link';
import { getAboutUsData } from '@/database';


import { orderStatus } from '@/config';

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
          <p>A confirmation email has been sent to <span className={styles.email}>{shippingAddress.email}</span>.</p>
          <p>You can check the status of your order <Link href={'/order/' + order.id} className={styles.linkToOrderPage}>HERE</Link></p>
          <p>Please remember your order number to contact our customer service by email at {contactInfo.email}, or by phone at {contactInfo.phone}.</p>
          <p>Thank you for choosing Nail Essential for all of your nail care needs!</p>
        </section>
      </div>
    </PageLayout>
  )
}

Confirmation.displayName = "Confirmation";


const shippingAddress: ShippingAddress = {
  name: "John Doe",
  address1: "1234 Main Street",
  address2: "Apt 1",
  city: "New York",
  state: "NY",
  zip: "10001",
  email: "john@example.com"
}; 

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

  const order:Order = {
    id: "123456",
    shippingAddress,
    orderedProducts,
    status: {
      value: "processing",
      description: orderStatus["processing"],
      lastUpdated: new Date().toDateString()
    }
  }

  try {
    const [aboutUsRes] = await Promise.all([getAboutUsData()]);

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
        order
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


