import PageLayout from '@/components/layouts/PageLayout'
import HeroImageSection from '@/components/sections/HeroImageSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import CategoryIntroSection from '@/components/sections/CategoryIntroSection';

import styles from '@/styles/pages/Home.module.scss'

import { homeConfig } from '@/config';
import type { ContactInfo } from '@/types/others';
import type { Props as FeaturedProductGroup } from '@/components/composites/FeaturedProductGroup';
import type { Category } from '@/types/category';


export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
  featuredProductGroups: FeaturedProductGroup[],
  categories: Category[]
};

export default function Home({contactInfo, aboutTextFooter, featuredProductGroups, categories}:Props) {


  const { heroImageSectionProps, categoryIntro} = homeConfig;

  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
    >
      <HeroImageSection {...heroImageSectionProps} />
      <FeaturedProductsSection
        featuredProductGroups = {featuredProductGroups}
      />
      <CategoryIntroSection
        categoryIntro = {categoryIntro} 
        categories = {categories}
      />
    </PageLayout>
  )
}
