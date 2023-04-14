import { GetServerSideProps } from "next";

import PageLayout from "@/components/layouts/PageLayout";
import { ContactInfo } from "@/types/others";

import styles from "@/styles/pages/Search.module.scss";
import ProductList from "@/components/composites/ProductList";

import { ProductGroup, Product } from "@/types/product";

import { getAboutUsData,  getProducts } from "@/database";



export interface Props {
  errorMessage?: string;
  contactInfo: ContactInfo;
  aboutUsFooter: string;
  products: (Product | ProductGroup)[];
  term: string;
}

export default function SearchResultPage({
  errorMessage,
  contactInfo,
  aboutUsFooter,
  products,
  term  
}: Props) {
  
  if (errorMessage) {
    throw new Error(errorMessage);
  }


  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <div className={styles.wrapper}>
        <section className={styles.header}>
          <h2>SEARCH RESULT FOR <span className={styles.term}>{term}</span></h2>
        </section>
        <section className={styles.productList}>
          <ProductList products={products} type="grid" />
        </section>
      </div>
    </PageLayout>
  );
}

SearchResultPage.displayName = "SearchResultPage";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { term } = context.query;

  if(typeof term !== 'string'){
    return {
      props: {
        errorMessage: "Search term not found",
      },
    };
  }

  
  try {
    const [aboutUsRes, productsRes] = await Promise.all([
      getAboutUsData(),
      getProducts({
        type: "all",
        searchTerm: term,
      }),
    ]);

    if (!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message,
        },
      };
    }


    if (!productsRes.success) {
      return {
        props: {
          errorMessage: productsRes.message,
        },
      };
    }

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;


    const products = productsRes.data;

    return {
      props: {
        contactInfo,
        aboutUsFooter,
        products,
        term
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