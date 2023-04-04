import { GetServerSideProps } from 'next';

import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';

import styles from '@/styles/pages/OrderPage.module.scss';
import { Order } from '@/types/order';
import OrderSummary from '@/components/composites/OrderSummary';

import { orderStatus } from '@/config';
import { ShippingAddress } from '@/types/order';

import { getAboutUsData } from '@/database';


export interface Props {
  errorMessage?: string,
  contactInfo: ContactInfo,
  aboutUsFooter: string,
  order: Order,  
};

export default function OrderPage({errorMessage, contactInfo, aboutUsFooter, order}:Props) {
  
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
          <h3 className={styles.orderNumber}>
            <span className={styles.label}>ORDER NUMBER:</span><span className={styles.value}>{order.id}</span>
          </h3>
        </section>
        <section className={styles.status}>
          <h2 className={styles.title}>
            <span className={styles.label}>STATUS:</span> 
            <span className={styles.value}>{order.status.value}</span>
          </h2>
          <p className={styles.lastUpdated}>(Last updated: {order.status.lastUpdated})</p>
          <p className={styles.description}>{order.status.description}</p>
        </section>
        <section className={styles.orderSummary}>
          <OrderSummary orderedProducts={order.orderedProducts} />
        </section>
        <section className={styles.text}>
          <p>If you have any question, please contact our customer service, by email at {contactInfo.email}, or by phone at {contactInfo.phone}</p>
        </section>
      </div>
    </PageLayout>
  )
}

OrderPage.displayName = "OrderPage";


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



export const getServerSideProps:GetServerSideProps = async (context) => {
  


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
