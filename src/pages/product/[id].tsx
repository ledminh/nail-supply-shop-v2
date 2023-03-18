import { GetServerSideProps } from 'next';

import { Product } from '@/types/product';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';
import Link from 'next/link';

import { useCategory } from '@/contexts/CategoryContext';

import styles from '@/styles/pages/Category.module.scss'
import ImagesCarousellSection from '@/components/sections/ImagesCarousell';
import ProductInfo from '@/components/composites/ProductInfo';
import ButtonCPN from '@/components/basics/ButtonCPN';
import QuantityPickerCPN from '@/components/basics/QuantityPicker';
import { ProductImage } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
  productID: string,
  images: ProductImage[],
  name: string,
  intro: string,
  details: string,
  price: number,
  
  categoryID: string

  groupName?: string,
  otherProducts?: Product[],
};

export default function ProductPage({productID, contactInfo, aboutTextFooter, images, name, intro, groupName, otherProducts, price, categoryID, details }:Props) {

  const router = useRouter();
  const [quantity, setQuantity] = useState(0);

  const {addToCart} = useCart();
  const {getCategoryProps} = useCategory();

  const {name: categoryName, slug:categorySlug} = getCategoryProps({
    categoryID,
    props: ['name', 'slug'] 
  });


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
                        onClick={() => {
                          addToCart({
                              id: productID,
                              name: name,
                              price: price,
                              quantity: quantity,
                              image: images[0]
                            })
                          }
                        }
                      />
                      <QuantityPickerCPN
                        value={quantity}
                        onChange = {(q) => { setQuantity(q) }}
                        buttonClassName = {styles.quantityButton}
                        valueClassName =  {styles.quantityValue}
                        className = {styles.quantityPicker}
                      />
                  </div>
              </div>
              <div className={styles.category}>
                  <h4 className={styles.label}>Category:</h4>
                  <Link
                      href={`/category/${categorySlug}`}
                      className={styles.categoryLink}
                    >
                      {categoryName}
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

  const {id} = context.params as {id: string};


  const images =  [
    {
      id: "img-1",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 1"
    },
    {
      id: "img-2",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 2"
    },
    {
      id: "img-3",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 3"
    },
    {
      id: "img-4",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 4"
    },
    {
      id: "img-5",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 5"
    },
    {
      id: "img-6",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 6"
    }
  ]


  return {
    props: {
      contactInfo,
      aboutTextFooter,

      productID: id,
      images: images,
      name: "Product Name",
      intro: "This is some intro text. I'm trying to make it longer to see if it fit on the frame.",
      details: "This is some details text. I'm trying to make it longer to see if it fit on the frame. Something more to say here to make it longer, and even longer, longer, longer.",
      price: 100,
      
      categoryID: "1"

      // groupName?: string,
      // otherProducts?: Product[],
    }
  }
}
