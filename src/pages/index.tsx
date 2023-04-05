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
  
  


  try {
    const newArrivalOptions:FindProductOptions = {
      limit: 6,
      sort: 'dateCreated',
      sortedOrder: 'desc',
      type: 'product'
    }

    const customerFavoritesOptions:FindProductOptions = {
      limit: 6,
      sort: 'sellCount',
      sortedOrder: 'desc',
      type: 'product'
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
