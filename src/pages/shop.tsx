import { ContactInfo } from "@/types/others";
import { Category } from "@/types/category";

import PageLayout from "@/components/layouts/PageLayout";
import CategoryList from "@components/composites/CategoryList";

import styles from "@/styles/pages/Shop.module.scss";

import { shopConfig } from "@/config";
import HeroImageSection from "@/components/sections/HeroImageSection";

import { getAboutUsData, getCategories } from "@/database";

export interface Props {
  errorMessage?: string;
  contactInfo: ContactInfo;
  aboutUsFooter: string;
  categories: Category[];
}

export default function Shop({
  errorMessage,
  contactInfo,
  aboutUsFooter,
  categories,
}: Props) {
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const { heroImageSectionProps } = shopConfig;

  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <HeroImageSection {...heroImageSectionProps} />

      <section className={styles.categoryList}>
        <CategoryList categories={categories} detailed={true} />
      </section>
    </PageLayout>
  );
}

Shop.displayName = "Shop";

export const getServerSideProps = async () => {
  try {
    const [aboutUsRes, categoriesRes] = await Promise.all([
      getAboutUsData(),
      getCategories(),
    ]);

    if (!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message,
        },
      };
    }

    if (!categoriesRes.success) {
      return {
        props: {
          errorMessage: categoriesRes.message,
        },
      };
    }

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    const categories = categoriesRes.data;

    return {
      props: {
        contactInfo,
        aboutUsFooter,
        categories,
      },
    };
  } catch (err: any) {
    return {
      props: {
        errorMessage: err.message,
      },
    };
  }
};
