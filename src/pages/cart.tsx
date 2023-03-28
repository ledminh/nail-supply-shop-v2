import { ContactInfo } from '@/types/others';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Cart.module.scss'

export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
};

export default function Cart({contactInfo, aboutTextFooter }:Props) {


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
    >

    </PageLayout>
  )
}

Cart.displayName = "Cart";

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
