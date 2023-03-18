import { GetServerSideProps } from 'next';

import { Product } from '@/types/product';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';
import Link from 'next/link';

import styles from '@/styles/pages/Category.module.scss'
import ImagesCarousellSection from '@/components/sections/ImagesCarousell';
import ProductInfo from '@/components/composites/ProductInfo';
import ButtonCPN from '@/components/basics/ButtonCPN';
import QuantityPickerCPN from '@/components/basics/QuantityPicker';
import { ProductImage } from '@/types/product';

export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
  images: ProductImage[],
  name: string,
  intro: string,
  groupName?: string,
  otherProducts?: Product[],
  price: string,
  category: {
    name: string,
    slug: string
  },
  details: string,
};

export default function ProductPage({contactInfo, aboutTextFooter, images, name, intro, groupName, otherProducts, price, category, details }:Props) {

  const router = useRouter();
  const [quantity, setQuantity] = useState(0);


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
    >
      <div className={styles.wrapper}>
          <ImagesCarousellSection images={images}/>
          <section className={styles.productInfo}>
              <ProductInfo
                  name = {name} 
                  intro = {intro}
                  groupName = {groupName}
                  otherProducts = {otherProducts}
                  router = {router}
              />
              <div className={styles.footer}>
                  <h3 className={styles.price}>{price}</h3>
                  <div className={styles.addToCart}>
                      <ButtonCPN 
                        type="normal"
                        label="Add to Cart"
                        className={styles.addToCartButton}
                        onClick={() => console.log("Add to cart")}
                      />
                      <QuantityPickerCPN
                        value={quantity}
                        onChange = {(q) => {}}
                        buttonClassName = {styles.quantityButton}
                        valueClassName =  {styles.quantityValue}
                        className = {styles.quantityPicker}
                      />
                  </div>
              </div>
              <div className={styles.category}>
                  <h4 className={styles.label}>Category:</h4>
                  <Link
                      href={`/category/${category.slug}`}
                      className={styles.categoryLink}
                    >
                      {category.name}
                  </Link>
              </div>
          </section>
          <section className={styles.details}>
              <h3 className={styles.title}>Details</h3>
              <p>{details}</p>
          </section>
      </div>
    </PageLayout>
  )
}

ProductPage.displayName = "ProductPage";



// export const getServerSideProps:GetServerSideProps<Props> = async (context) => {
  


//   const aboutTextFooter = "Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. Our mission is to make it easy for our customers to find the products they need to create beautiful and healthy nails. We take pride in offering a wide selection of top-quality products, competitive pricing, and exceptional customer service. Thank you for choosing Nail Essential for all of your nail care needs."

//   const contactInfo:ContactInfo = {
//       email: "customer.service@example.com",
//       phone: "1-800-555-5555",
//       additionalInfos: [
//           "Monday - Friday: 9:00am - 5:00pm EST",
//           "Saturday: 10:00am - 2:00pm EST",
//           "Sunday: Closed"
//       ]
//   }




//   return {
//     props: {
//       contactInfo,
//       aboutTextFooter,
      
//     }
//   }
// }
