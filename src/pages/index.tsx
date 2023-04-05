import PageLayout from '@/components/layouts/PageLayout'
import HeroImageSection from '@/components/sections/HeroImageSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import CategoryIntroSection from '@/components/sections/CategoryIntroSection';

import { homeConfig } from '@/config';
import type { ContactInfo } from '@/types/others';
import type { Props as FeaturedProductGroup } from '@/components/composites/FeaturedProductGroup';
import type { Category } from '@/types/category';

import { getAboutUsData, getCategories, getProducts } from '@/database';
import { FindProductOptions } from '@/database/models/product';


export interface Props {
  errorMessage?: string,
  contactInfo: ContactInfo,
  aboutUsFooter: string,
  featuredProductGroups: FeaturedProductGroup[],
  categories: Category[]
};

export default function Home({errorMessage, contactInfo, aboutUsFooter, featuredProductGroups, categories}:Props) {

  if(errorMessage) {
    throw new Error(errorMessage);
  }


  const { heroImageSectionProps, categoryIntro} = homeConfig;

  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutUsFooter}
    >
      <HeroImageSection {...heroImageSectionProps} />
      <FeaturedProductsSection
        featuredProductGroups = {featuredProductGroups}
      />
      <CategoryIntroSection
        categoryIntro = {categoryIntro} 
        categories = {categories.slice(0, 4)}
      />
    </PageLayout>
  )
}

Home.displayName = "Home";

export const getServerSideProps = async () => {
  
  


const productSample = {
    id: "1",
    name: "Product Name",
    price: 100,
    intro: "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
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
        id: "1"
    },
    {
        ...productSample,
        id: "2"
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
  
const featuredProductGroups = [
    {
      title: "New Arrivals",
      mainProduct: productSample,
      otherProducts: productSamples
    },
    {
      title: "Customer Favorites",
      mainProduct: productSample,
      otherProducts: productSamples
    },
]



  try {
    const newArrivalOptions:FindProductOptions = {
      limit: 6,
      sort: 'dateCreated',
      sortedOrder: 'desc'
    }

    const customerFavoritesOptions:FindProductOptions = {
      limit: 6,
      sort: 'sellCount',
      sortedOrder: 'desc'
    }



    const [aboutUsRes, categoriesRes, resNewArrivals, resCustomerFavorites] = await Promise.all([getAboutUsData(), getCategories({}), getProducts(newArrivalOptions), getProducts(customerFavoritesOptions)]);
  
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

    if (!resNewArrivals.success) {
      return {
        props: {
          errorMessage: resNewArrivals.message
        }
      }
    }

    if (!resCustomerFavorites.success) {
      return {
        props: {
          errorMessage: resCustomerFavorites.message
        }
      }
    }

    if(!Array.isArray(resNewArrivals.data)) {
      return {
        props: {
          errorMessage: "New Arrivals data is not an array"
        }
      }
    }

    if(!Array.isArray(resCustomerFavorites.data)) {
      return {
        props: {
          errorMessage: "Customer Favorites data is not an array"
        }
      }
    }

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    const categories = categoriesRes.data;
    const featuredProductGroups = [
      {
        title: "New Arrivals",
        mainProduct: resNewArrivals.data[0],
        otherProducts: resNewArrivals.data.slice(1)
      },
      {
        title: "Customer Favorites",
        mainProduct: resCustomerFavorites.data[0],
        otherProducts: resCustomerFavorites.data.slice(1)
      },
    ]



    
    return {
      props: {
        contactInfo,
        aboutUsFooter,
        featuredProductGroups,
        categories
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
