import { ContactInfo } from '@/types/others';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Checkout.module.scss'
import StripeCheckoutButtonCPN from '@/components/basics/StripeCheckoutButton';
import OrderDetail from '@/components/composites/OrderDetail';
import ShippingAddressForm from '@/components/composites/ShippingAddressForm';

import Link from 'next/link';


export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
};

export default function Checkout({contactInfo, aboutTextFooter }:Props) {


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
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
          <ShippingAddressForm/>
          <StripeCheckoutButtonCPN amount={10000}/>  
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
  
  const aboutTextFooter = "Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. Our mission is to make it easy for our customers to find the products they need to create beautiful and healthy nails. We take pride in offering a wide selection of top-quality products, competitive pricing, and exceptional customer service. Thank you for choosing Nail Essential for all of your nail care needs."

const contactInfo:ContactInfo = {
    email: "customer.service@example.com",
    phone: "1-800-555-5555",
    additionalInfos: [
        "Monday - Friday: 9:00am - 5:00pm EST",
        "Saturday: 10:00am - 2:00pm EST",
        "Sunday: Closed"
    ]
}



  return {
    props: {
      contactInfo,
      aboutTextFooter
    }
  }
}

