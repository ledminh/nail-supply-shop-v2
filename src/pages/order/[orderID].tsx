import { GetServerSideProps } from 'next';

import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';

import styles from '@/styles/pages/OrderPage.module.scss';
import { Order } from '@/types/order';
import OrderSummary from '@/components/composites/OrderSummary';

import { getOrder } from '@/database';

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
          <h2 className={styles.orderNumber}>
            <span className={styles.label}>ORDER NUMBER:</span><span className={styles.value}>{order.id}</span>
          </h2>
        </section>
        <section className={styles.status}>
          <h3 className={styles.title}>
            <span className={styles.label}>STATUS:</span> 
            <span className={styles.value}>{order.status.value}</span>
          </h3>
          <p className={styles.lastUpdated}>(Last updated: {formatDate(order.status.lastUpdated)})</p>
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





export const getServerSideProps:GetServerSideProps = async (context) => {
  if(!context.params || typeof context.params.orderID !== 'string') {
    return {
      props: {
        errorMessage: "No order ID provided"
      }
    }
  }


  const orderID = context.params.orderID;



  try {
    const [aboutUsRes, orderRes] = await Promise.all([getAboutUsData(), getOrder(orderID)]);

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


    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    const order = orderRes.data;    
    
    
    
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

/****************************
 * Helper functions
 */


function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}