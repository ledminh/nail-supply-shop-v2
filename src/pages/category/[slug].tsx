import { useState } from 'react';

import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';
import { Category } from '@/types/category';

import styles from '@/styles/pages/Category.module.scss'
import CategoryInfo from '@/components/composites/CategoryInfo';
import SortAndOrder from '@/components/composites/SortAndOrder';
import CategoryList from '@/components/composites/CategoryList';
import ProductList from '@/components/composites/ProductList';

import { categoryConfig } from '@/config';
import { ProductGroup, Product } from '@/types/product';
import ButtonCPN from '@/components/basics/ButtonCPN';
import useSortAndOrder from '@/hooks/useSortAndOrder';

export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
  currentCategory: Category,
  categories: Category[],
  products: (Product|ProductGroup)[],
};

export default function Category({contactInfo, aboutTextFooter, currentCategory, categories, products }:Props) {

  const { id:categoryID, name, image, description } = currentCategory;
  const {sortItems, sortedOrderItems, initCondition} = categoryConfig;

  const [_products, setProducts] = useState<(Product|ProductGroup)[]>(products);

  const {sortAndOrderOnChange} = useSortAndOrder({setProducts, categoryID});

  const addToCart = () => {
    console.log("Add to cart");
  }

  const loadMore = () => {
    console.log("Load more");
  }


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
    >
      <aside className={styles.aside}>
        <CategoryInfo
          name = {name}
          image = {image}
          description = {description}
        />
        <SortAndOrder
          sortItems = {sortItems}
          sortedOrderItems = {sortedOrderItems} 
          initCondition = {initCondition}
          onChange = {sortAndOrderOnChange}
        />
        <CategoryList
          categories = {categories}
          vertical = {true}
        />
      </aside>
      <div className={styles.main}>
        <ProductList
          products = {_products}
          type = "grid"
          addToCart = {addToCart}
        />
        <ButtonCPN
          label = "Load More"
          type="normal"
          onClick = {loadMore}
        />
      </div>
    </PageLayout>
  )
}

Category.displayName = "Category";

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


// const categorySample = {
//     image: {
//       src: "https://loremflickr.com/400/400",
//       alt: "Category Image",
//     },
//     name: "Category Name",
//     description: "lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon",
//   };
  
  
// const categories:Category[] = [
//     {
//         ...categorySample,
//         id: "1",
//         slug: "category-1"
//     },
//     {
//         ...categorySample,
//         id: "2",
//         slug: "category-2"
//     },
//     {
//         ...categorySample,
//         id: "3",
//         slug: "category-3"
//     },
//     {
//         ...categorySample,
//         id: "4",
//         slug: "category-4"
//     },
//     {
//         ...categorySample,
//         id: "5",
//         slug: "category-5"
//     },
//     {
//         ...categorySample,
//         id: "6",
//         slug: "category-6"
//     },
//     {
//         ...categorySample,
//         id: "7",
//         slug: "category-7"
//     },
//     {
//         ...categorySample,
//         id: "8",
//         slug: "category-8"
//     },
// ];


  return {
    props: {
      contactInfo,
      aboutTextFooter,
      // categories
    }
  }
}
