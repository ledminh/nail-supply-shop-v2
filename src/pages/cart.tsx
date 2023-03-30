import { ContactInfo } from '@/types/others';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Cart.module.scss'
import List from '@/components/generics/List';
import OrderedProduct from '@/components/composites/OrderedProduct';
import { OrderedProduct as OrderedProductType} from '@/types/product';
import Link from 'next/link';

export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
};

export default function Cart({contactInfo, aboutTextFooter }:Props) {

  

  const onChange = ({id, quantity}: {id:string, quantity:number}) => {
    console.log("onChange", id, quantity);
  }

  const onRemove = (id:string) => {
    console.log("onRemove", id);
  }

  const onCheckout = () => {}

  const cartItems:OrderedProductType[] = [
    {
      id: "1",
      name: "Nail Essential 1",
      price: 100,
      quantity: 1,
      image: {
        src: "/images/placeholder_1.png",
        alt: "sample image",
      }
    },
    {
      id: "2",
      name: "Nail Essential 2",
      price: 200,
      quantity: 2,
      image: {
        src: "/images/placeholder_2.png",
        alt: "sample image",
      }
    },
    {
      id: "3",
      name: "Nail Essential 3",
      price: 300,
      quantity: 3,
      image: {
        src: "/images/placeholder_3.png",
        alt: "sample image",
      }
    },
    {
      id: "4",
      name: "Nail Essential 4",
      price: 400,
      quantity: 4,
      image: {
        src: "/images/placeholder_4.png",
        alt: "sample image",
      }
    },
    {
      id: "5",
      name: "Nail Essential 5",
      price: 500,
      quantity: 5,
      image: {
        src: "/images/placeholder_5.png",
        alt: "sample image",
      }
    }
  ]


  const ItemWrapper = getItemWrapper({
    onChange,
    onRemove
  });  

  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
    >
      <section className={styles.section + " " + styles.header}>
        <h2 className={styles.title}>SHOPPING CART</h2>
        <h3 className={styles.numItems}>(9 items)</h3>
      </section>
      <section className={styles.section + " " + styles.cart}>
        <List 
          items = {cartItems} 
          ItemCPN = {ItemWrapper}
          liClass = {styles.liClass}
          ulClass = {styles.ulClass}
          />
      </section>
      <section className={styles.section + " " + styles.footer}>
        <button className={styles.checkoutButton}
          onClick={() => onCheckout()}
        >
          CHECK OUT
        </button>
        <p><span>TOTAL: </span><span>$10000</span></p>
        <Link className={styles.continueShopping} href="/shop">CONTINUE SHOPPING</Link>
      </section>
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


/**************************
 * Helpers
 */

type getItemWrapperProps = {
  onChange: ({id, quantity}: {id:string, quantity:number}) => void;
  onRemove: (id:string) => void;
}

function getItemWrapper({onChange, onRemove}:getItemWrapperProps) {

  const ItemWrapper = (orderedProduct: OrderedProductType) => {
    return (
      <OrderedProduct {...orderedProduct} onChange={onChange} onRemove={onRemove}/>
    )
  }

  return ItemWrapper;
}