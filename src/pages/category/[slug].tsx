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

import { getAboutUsData } from '@/database';


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
    let sortItem = categoryConfig.sortItems[0];
    let sortedOrderItem = categoryConfig.sortedOrderItems[0];

    if(sort) {
      const sortItemIndex = categoryConfig.sortItems.findIndex(item => item.value === sort);

      if(sortItemIndex !== -1) {
        sortItem = categoryConfig.sortItems[sortItemIndex];
      }
    }

    if(sortedOrder) {
      const sortedOrderItemIndex = categoryConfig.sortedOrderItems.findIndex(item => item.value === sortedOrder);

      if(sortedOrderItemIndex !== -1) {
        sortedOrderItem = categoryConfig.sortedOrderItems[sortedOrderItemIndex];
      }
    }

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
  ];

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
        categories,
        currentCategory: categories[1],
        products: productWithGroupSamples,
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


