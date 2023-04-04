import { GetServerSideProps } from 'next';

import { useState } from 'react';
import { useRouter } from 'next/router';

import PageLayout from '@/components/layouts/PageLayout'
import { ContactInfo } from '@/types/others';
import { Category } from '@/types/category';

import styles from '@/styles/pages/Category.module.scss'
import CategoryInfo from '@/components/composites/CategoryInfo';
import SortAndOrder from '@/components/composites/SortAndOrder';
import ProductList from '@/components/composites/ProductList';

import { categoryConfig } from '@/config';
import { ProductGroup, Product } from '@/types/product';
import { ListCondition } from '@/types/list-conditions';
import ButtonCPN from '@/components/basics/ButtonCPN';
import useSortAndOrder from '@/hooks/useSortAndOrder';
import useProducts from '@/hooks/useProducts';
import { useCart } from '@contexts/CartContext';
import Select, { convertToOptionItem } from '@/components/generics/Select';

import { getAboutUsData, getCategories, getProducts } from '@/database';


export interface Props {
  errorMessage?: string,

  contactInfo: ContactInfo,
  aboutUsFooter: string,
  currentCategory: Category,
  categories: Category[],
  products: (Product|ProductGroup)[],
  numProducts: number,
  initCondition: ListCondition,

};

export default function CategoryPage({errorMessage, contactInfo, aboutUsFooter, currentCategory, categories, products, numProducts, initCondition }:Props) {

  if(errorMessage) {
    throw new Error(errorMessage);
  }

  const [firstLoad, setFirstLoad] = useState(true);

  const router = useRouter();


  const { id:categoryID, name, image, description } = currentCategory;
  const {sortItems, sortedOrderItems, productsPerPage} = categoryConfig;


  const {_products, setProducts, loadMore, isLoadMoreNeeded} = useProducts({products, categoryID, numProducts, productsPerPage})

  const {sortAndOrderOnChange} = useSortAndOrder({router, setProducts, categoryID, productsPerPage, firstLoad, setFirstLoad});

  const {addToCart} = useCart();


  const convertCategoryToOptionItem = (category: Category) => {

    const getValue = (category: Category) => category.slug;
    const getLabel = (category: Category) => category.name;

    return convertToOptionItem({item:category, getValue, getLabel});

  }


  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutUsFooter}
    >
      <div className={styles.wrapper}>
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
          <Select
              selectClass = {styles.categorySelect}
              optionClass = {styles.categoryOption}
              optionItems = {categories.map(convertCategoryToOptionItem)}
              initOptionItem = {convertCategoryToOptionItem(currentCategory)}
              onChange = {(cat) => {router.push(`/category/${cat.value}`)}}
            />
        </aside>
        <div className={styles.main}>
          <div className={styles.productList}>
            <ProductList
              products = {_products}
              type = "grid"
              addToCart = {addToCart}
            />
          </div>
          <div className={styles.button}>
            {
              isLoadMoreNeeded && (
                <ButtonCPN
                  label = "Load More"
                  type="normal"
                  onClick = {loadMore}
                  className={styles.loadMoreButton}
                />
              )
            }
          </div>        
        </div>
      </div>
      
    </PageLayout>
  )
}

CategoryPage.displayName = "Category";

export const getServerSideProps:GetServerSideProps = async (context) => {
  
  const { sort, sortedOrder } = context.query;
  const params = context.params as {slug: string};
  const { slug } = params;

  if(!sort || !sortedOrder) {
    return redirectToSortedPage(sort, sortedOrder, slug);
  }


  const categorySample = {
      image: {
        src: "https://loremflickr.com/400/400",
        alt: "Category Image",
      },
      name: "Category Name",
      description: "lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon",
    };
    
    

  const productSample = {
    id: "1",
    name: "Product Name",
    price: 100,
    intro: "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
    details: "This is some details text. I'm trying to make it longer to see if it fit on the frame. Something more to say here to make it longer, and even longer, longer, longer.",
    categoryID: '1',
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

  const productWithGroupSamples = [
    {
      ...productSample,
      id: "1"
    },
    {
      name: "Product Group Name",
      products: [
        {
          ...productSample,
          id: "1",
          name: "Product Name 1",
          price: 100,
        },
        {
          ...productSample,
          id: "2",
          name: "Product Name 2",
          price: 200,
        },
        {
          ...productSample,
          id: "3",
          name: "Product Name 3",
          price: 300,
        },
      ],
      id: "2",
      categoryID: "1"
    },
    {
      ...productSample,
      id: "3"
    },
    {
      ...productSample,
      id: "4"
    },
    {
      ...productSample,
      id: "5"
    }
  ]


  const sortItemIndex = categoryConfig.sortItems.findIndex(item => item.value === sort);
  const sortedOrderItemIndex = categoryConfig.sortedOrderItems.findIndex(item => item.value === sortedOrder);

  const sortItem = sortItemIndex !== -1? categoryConfig.sortItems[sortItemIndex]: categoryConfig.sortItems[0];
  const sortedOrderItem = sortedOrderItemIndex !== -1? categoryConfig.sortedOrderItems[sortedOrderItemIndex]: categoryConfig.sortedOrderItems[0];


  try {
    const [aboutUsRes, categoriesRes, productsRes] = await Promise.all([getAboutUsData(), getCategories({}), getProducts({catSlug: slug})]);



    if(!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message
        }
      }
    }

    if(!categoriesRes.success) {
      return {
        props: {
          errorMessage: categoriesRes.message
        }
      }
    }

    if(!productsRes.success) {
      return {
        props: {
          errorMessage: productsRes.message
        }
      }
    }


    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    const categories = categoriesRes.data;

    const currentCategory = categories.find(cat => cat.slug === slug);


    if(!currentCategory) {
      throw new Error("Category not found");
    }
    
    const products = productsRes.data;

    return {
      props: {
        contactInfo,
        aboutUsFooter,
        categories,
        currentCategory,
        products,
        initCondition: {
          sort: sortItem,
          sortedOrder: sortedOrderItem,
        },

        numProducts: 10,
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
 * Helper Functions
 */

const redirectToSortedPage = (sort:string | string[] | undefined, sortedOrder:string | string[] | undefined, slug: string) => {

  let sortItemIndex = sort? categoryConfig.sortItems.findIndex(item => item.value === sort) : 0;
  let sortedOrderItemIndex = sortedOrder? categoryConfig.sortedOrderItems.findIndex(item => item.value === sortedOrder) : 0;


  const sortItem = categoryConfig.sortItems[sortItemIndex === -1? 0 : sortItemIndex];
  const sortedOrderItem = categoryConfig.sortedOrderItems[sortedOrderItemIndex === -1? 0 : sortedOrderItemIndex];
  
  const queryParams = {
    sort: sortItem.value,
    sortedOrder: sortedOrderItem.value,
  };


  return {
    redirect: {
      destination: `/category/${slug}?${new URLSearchParams(queryParams)}`,
      permanent: true,
    },
  };

}

