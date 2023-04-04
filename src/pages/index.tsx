import PageLayout from '@/components/layouts/PageLayout'
import HeroImageSection from '@/components/sections/HeroImageSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import CategoryIntroSection from '@/components/sections/CategoryIntroSection';

import { homeConfig } from '@/config';
import type { ContactInfo } from '@/types/others';
import type { Props as FeaturedProductGroup } from '@/components/composites/FeaturedProductGroup';
import type { Category } from '@/types/category';

import { getAboutUsData } from '@/database';


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
