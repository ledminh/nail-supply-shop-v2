import { ContactInfo } from '@/types/others';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/Cart.module.scss'
import List from '@/components/generics/List';
import OrderedProduct from '@/components/composites/OrderedProduct';
import { OrderedProduct as OrderedProductType} from '@/types/product';
import Link from 'next/link';

import { getAboutUsData } from '@/database';



import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';

export interface Props {
  errorMessage?: string,
  contactInfo: ContactInfo,
  aboutUsFooter: string,
};



export default function Cart({errorMessage, contactInfo, aboutUsFooter }:Props) {

  if(errorMessage) {
    throw new Error(errorMessage);
  }

  const {cart, updateCart, removeProduct} = useCart();


  const [totalPrice, setTotalPrice] = useState<number>(getTotalPrice(cart));
  const [numItems, setNumItems] = useState<number>(getNumItems(cart));

  const router = useRouter();


  useEffect(() => {
    setTotalPrice(getTotalPrice(cart));
    setNumItems(getNumItems(cart));
  }, [cart]);
  

  
  const onCheckout = () => router.push("/checkout");


  const ItemWrapper = getItemWrapper({
    onChange: updateCart,
    onRemove: removeProduct
  });  

  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutUsFooter}
    >
      <div className={styles.wrapper}>
        <section className={styles.section + " " + styles.header}>
          <h2 className={styles.title}>SHOPPING CART</h2>
          <h3 className={styles.numItems}>({numItems} items)</h3>
        </section>
        <section className={styles.section + " " + styles.cart}>
          <List 
            items = {cart} 
            ItemCPN = {ItemWrapper}
            liClass = {styles.liClass}
            ulClass = {styles.ulClass}
            />
        </section>
        <section className={styles.section + " " + styles.footer}>
          <button className={styles.checkoutButton}
            onClick={() => onCheckout()}
            disabled={numItems === 0}
          >
            CHECK OUT
          </button>
          <p className={styles.total}><span>TOTAL: </span><span>${totalPrice}</span></p>
          <Link className={styles.continueShopping} href="/shop">CONTINUE SHOPPING</Link>
        </section>
      </div>
    </PageLayout>
  )
}

Cart.displayName = "Cart";

export const getServerSideProps = async () => {
  

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


/**************************
 * Helpers
 */

type getItemWrapperProps = {
  onChange: (id:string, quantity:number) => void;
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


function getTotalPrice(cartItems: OrderedProductType[]) {
  return cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
}

function getNumItems(cartItems: OrderedProductType[]) {
  return cartItems.reduce((acc, cur) => acc + cur.quantity, 0);
}