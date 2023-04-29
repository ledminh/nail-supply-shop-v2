import PageLayout from "@/components/layouts/PageLayout";
import HeroImageSection from "@/components/sections/HeroImageSection";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";
import CategoryIntroSection from "@/components/sections/CategoryIntroSection";

import { homeConfig } from "@/config";
import type { ContactInfo } from "@/types/others";
import type { Props as FeaturedProductGroup } from "@/components/composites/FeaturedProductGroup";
import type { Category } from "@/types/category";

import { getAboutUsData, getCategories, getProducts } from "@/database";
import { FindProductOptions } from "@/database/models/product";
import isProduct from "@/utils/isProduct";

export interface Props {
  errorMessage?: string;
  contactInfo: ContactInfo;
  aboutUsFooter: string;
  featuredProductGroups: FeaturedProductGroup[];
  categories: Category[];
}

export default function Home({
  errorMessage,
  contactInfo,
  aboutUsFooter,
  featuredProductGroups,
  categories,
}: Props) {
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const { heroImageSectionProps, categoryIntro } = homeConfig;

  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <HeroImageSection {...heroImageSectionProps} />
      <FeaturedProductsSection featuredProductGroups={featuredProductGroups} />
      <CategoryIntroSection
        categoryIntro={categoryIntro}
        categories={categories.slice(0, 4)}
      />
    </PageLayout>
  );
}

Home.displayName = "Home";

export const getServerSideProps = async () => {
  try {
    const newArrivalOptions: FindProductOptions = {
      limit: 6,
      sort: "dateCreated",
      sortedOrder: "desc",
      type: "product",
    };

    const customerFavoritesOptions: FindProductOptions = {
      limit: 6,
      sort: "sellCount",
      sortedOrder: "desc",
      type: "product",
    };

    const [aboutUsRes, categoriesRes, resNewArrivals, resCustomerFavorites] =
      await Promise.all([
        getAboutUsData(),
        getCategories(),
        getProducts(newArrivalOptions),
        getProducts(customerFavoritesOptions),
      ]);

    if (!aboutUsRes.success) {
      console.log("aboutUsRes");
      return {
        props: {
          errorMessage: aboutUsRes.message,
        },
      };
    }



    if (!categoriesRes.success) {
      console.log("cateogoiresRes");
      return {
        props: {
          errorMessage: categoriesRes.message,
        },
      };
    }

    if (!resNewArrivals.success) {
      console.log('resNewArrivals');
      return {
        props: {
          errorMessage: resNewArrivals.message,
        },
      };
    }

    if (!resCustomerFavorites.success) {
      console.log('resCustomerFavorites');
      return {
        props: {
          errorMessage: resCustomerFavorites.message,
        },
      };
    }

    if (!Array.isArray(resNewArrivals.data)) {
      return {
        props: {
          errorMessage: "New Arrivals data is not an array",
        },
      };
    }

    if (!Array.isArray(resCustomerFavorites.data)) {
      return {
        props: {
          errorMessage: "Customer Favorites data is not an array",
        },
      };
    }

    const newArrivalProduct = resNewArrivals.data.map((product) => {
      if (isProduct(product)) {
        return {
          ...product,
          groupID: product.groupID || null,
        };
      }

      return product;
    });

    const customerFavoritesProducts = resCustomerFavorites.data.map(
      (product) => {
        if (isProduct(product)) {
          return {
            ...product,
            groupID: product.groupID || null,
          };
        }

        return product;
      }
    );

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    const categories = categoriesRes.data;
    const featuredProductGroups = [
      {
        title: "New Arrivals",
        mainProduct: newArrivalProduct.length > 0 && newArrivalProduct[0],
        otherProducts: newArrivalProduct.slice(1),
      },
      {
        title: "Customer Favorites",
        mainProduct:
          customerFavoritesProducts.length > 0 && customerFavoritesProducts[0],
        otherProducts: customerFavoritesProducts.slice(1),
      },
    ];

    return {
      props: {
        contactInfo,
        aboutUsFooter,
        featuredProductGroups,
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
