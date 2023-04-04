import { ContactInfo } from '@/types/others';
import { Category } from '@/types/category';

import PageLayout from '@/components/layouts/PageLayout'
import CategoryList from '@components/composites/CategoryList';

import styles from '@/styles/pages/Shop.module.scss'

import { shopConfig } from '@/config';
import HeroImageSection from '@/components/sections/HeroImageSection';

import { getAboutUsData } from '@/database';

export interface Props {
  errorMessage?: string,
  contactInfo: ContactInfo,
  aboutUsFooter: string,
  categories: Category[]
};

export default function Shop({errorMessage, contactInfo, aboutUsFooter, categories }:Props) {

  if(errorMessage) {
    throw new Error(errorMessage);
  }
  
  const { heroImageSectionProps } = shopConfig;

  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutUsFooter}
    >
      <HeroImageSection {...heroImageSectionProps} />
      
      <section className={styles.categoryList}>
        <CategoryList 
          categories={categories}
          detailed={true}
          />
      </section>
    </PageLayout>
  )
}

Shop.displayName = "Shop";

export const getServerSideProps = async () => {
  


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
