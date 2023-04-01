import { GetServerSideProps } from 'next';

import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';

import styles from '@/styles/pages/OrderPage.module.scss';

export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
  orderID: string,
  
};

export default function OrderPage({contactInfo, aboutTextFooter, orderID}:Props) {

  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
    >
      <section className={styles.header}>
        <h3 className={styles.orderNumber}>
          <span className={styles.label}>ORDER NUMBER:</span>Order Number: <span className={styles.value}>{orderID}</span>
        </h3>
      </section>
      <section className={styles.status}>
        <h2 className={styles.title}>
          <span className={styles.label}>STATUS:</span> 
          <span className={styles.value}>Pending</span>
        </h2>
        <p className={styles.lastUpdated}>(Last updated: 03/12/2023)</p>
        <p className={styles.explanation}></p>
      </section>
    </PageLayout>
  )
}

OrderPage.displayName = "OrderPage";



export const getServerSideProps:GetServerSideProps<Props> = async (context) => {
  


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

  const {orderID} = context.params as {orderID: string};



  return {
    props: {
      contactInfo,
      aboutTextFooter,

      orderID
    }
  }
}
