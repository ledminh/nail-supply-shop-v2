import { GetServerSideProps } from 'next';

import { Product } from '@/types/product';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';
import Link from 'next/link';

import {Category} from '@/types/category';
import getCategoryProps  from '@/utils/getCategoryProps';


import styles from '@/styles/pages/Product.module.scss'
import ImagesCarousellSection from '@/components/sections/ImagesCarousell';
import ProductInfo from '@/components/composites/ProductInfo';
import ButtonCPN from '@/components/basics/ButtonCPN';
import QuantityPickerCPN from '@/components/basics/QuantityPicker';
import { ProductImage } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

import { getAboutUsData } from '@/database';


export interface Props {
  errorMessage?: string,

  contactInfo: ContactInfo,
  aboutUsFooter: string,
  productID: string,
  images: ProductImage[],
  name: string,
  intro: string,
  details: string,
  price: number,
  
  categoryID: string

  groupName?: string,
  otherProducts?: Product[],
  categories: Category[]
};

export default function ProductPage({errorMessage, productID, contactInfo, aboutUsFooter, images, name, intro, groupName, otherProducts, price, categoryID, details, categories }:Props) {

  if(errorMessage) {
    throw new Error(errorMessage);
  }

  const router = useRouter();
  const [quantity, setQuantity] = useState(0);

  const {addToCart} = useCart();


  const catProps = getCategoryProps({
    categories,
    categoryID,
    props: ['name', 'slug'] 
  });


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutUsFooter}
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
                  className = {styles.text}
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
                            });

                          setQuantity(0);
                          router.push('/cart');
                          
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
              {
                catProps && (              
                  <div className={styles.category}>
                      <h4 className={styles.label}>Category:</h4>
                      <Link
                          href={`/category/${catProps.slug}`}
                          className={styles.categoryLink}
                        >
                          <span>{catProps.name}</span>
                      </Link>
                  </div>
                )
              }
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



export const getServerSideProps:GetServerSideProps = async (context) => {
  



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
    
  ]

  const categorySample = {
    image: {
      src: "https://loremflickr.com/400/400",
      alt: "Category Image",
    },
    name: "Category Name",
    description: "lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon",
  };

  const categories:Category[] = [
    {
      ...categorySample,
      id: "1",
      slug: "category-1"
    },
    {
      ...categorySample,
      id: "2",
      slug: "category-2"
    },
    {
      ...categorySample,
      id: "3",
      slug: "category-3"
    },
    {
      ...categorySample,
      id: "4",
      slug: "category-4"
    },
    {
      ...categorySample,
      id: "5",
      slug: "category-5"
    },
    {
      ...categorySample,
      id: "6",
      slug: "category-6"
    },
    {
      ...categorySample,
      id: "7",
      slug: "category-7"
    },
    {
      ...categorySample,
      id: "8",
      slug: "category-8"
    },
  ]

  const productSample = {
    id: "1",
    name: "Product Name",
    price: 100,
    intro: "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
    details: "This is some details text. I'm trying to make it longer to see if it fit on the frame. Something more to say here to make it longer, and even longer, longer, longer",
    categoryID: "1",
    images: [
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
      }
    ]
  }
  
  const productSamples = [
    {
      ...productSample,
      name: 'Product Name 1',
      id: "1"
    },
    {
      ...productSample,
      name: 'Product Name 2',
      id: "2"
    },
    {
      ...productSample,
      name: 'Product Name 3',
      id: "3"
    },
    {
      ...productSample,
      name: 'Product Name 4',
      id: "4"
    },
    {
      ...productSample,
      name: 'Product Name 5',
      id: "5"
    }
  ]



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
        productID: id,
        images: images,
        name: "Product Name",
        intro: "This is some intro text. I'm trying to make it longer to see if it fit on the frame.",
        details: "This is some details text. I'm trying to make it longer to see if it fit on the frame. Something more to say here to make it longer, and even longer, longer, longer.",
        price: 100,
        
        categoryID: "1",
        categories,
        groupName: "Group Name",
        otherProducts: productSamples,
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
