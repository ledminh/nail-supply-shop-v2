import { ContactInfo } from '@/types/others';

import { ShippingAddress } from '@/types/order';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Confirmation.module.scss'


import ShippingAddressCPN from '@/components/basics/ShippingAddress';
import OrderSummary from '@/components/composites/OrderSummary';

import Link from 'next/link';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
  orderID: string,
  orderLink: string,
  
};

export default function Confirmation({contactInfo, aboutTextFooter, orderID }:Props) {


  const [linkToOrderPage, setLinkToOrderPage] = useState('');

  useEffect(() => {
    const rootUrl = `${window.location.protocol}//${window.location.hostname}`;

    setLinkToOrderPage(rootUrl + '/order/' + orderID);
  }, []);


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
    >
      <div className={styles.wrapper}>
        <section className={styles.header}>
          <h2 className={styles.title}>ORDER CONFIRMATION</h2>
          <h3 className={styles.orderNumber}>
            Order Number: <span className={styles.value}>{orderID}</span>
          </h3>
        </section>
        <section className={styles.shippingAddress}>
          <p>Thank you for your purchase!</p>
          <p>Your order has been confirmed and will be shipped to the following address:</p>
          <ShippingAddressCPN shippingAddress={shippingAddress}/>
        </section>
        <section className={styles.orderSummary}>
          <OrderSummary orderedProducts={orderedProducts}/>
        </section>
        <section className={styles.text}>
          <p>A confirmation email has been sent to <span className={styles.email}>{shippingAddress.email}</span>.</p>
          <p>You can check the status of your order at <Link href={linkToOrderPage} className={styles.linkToOrderPage}>{linkToOrderPage}</Link></p>
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
  
  const aboutTextFooter = "Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. Our mission is to make it easy for our customers to find the products they need to create beautiful and healthy nails. We take pride in offering a wide selection of top-quality products, competitive pricing, and exceptional customer service. Thank you for choosing Nail Essential for all of your nail care needs."

const contactInfo:ContactInfo = {
    email: "customer.service@example.com",
    phone: "1-800-555-5555",
    additionalInfos: [
        "Monday - Friday: 9:00am - 5:00pm EST",
        "Saturday: 10:00am - 2:00pm EST",
        "Sunday: Closed"
    ],
}



  return {
    props: {
      contactInfo,
      aboutTextFooter,
      orderID: "123456789",
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
  
  const {name, address1, city, state, zip} = shippingAddress;
  
  if (!name || !address1 || !city || !state || !zip) {
    return false;
  }


  return true;
}


