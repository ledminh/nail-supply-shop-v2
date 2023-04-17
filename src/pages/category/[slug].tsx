import { GetServerSideProps } from "next";

import { useState, useEffect } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import { ContactInfo } from "@/types/others";
import { Category } from "@/types/category";

import { useRouter } from "next/router";
import styles from "@/styles/pages/Category.module.scss";
import CategoryInfo from "@/components/composites/CategoryInfo";
import SortAndOrder from "@/components/composites/SortAndOrder";
import ProductList from "@/components/composites/ProductList";

import { categoryConfig } from "@/config";
import { ProductGroup, Product } from "@/types/product";
import { ListCondition } from "@/types/list-conditions";
import ButtonCPN from "@/components/basics/ButtonCPN";
import Select, { convertToOptionItem } from "@/components/generics/Select";

import { getAboutUsData, getCategories, getProducts } from "@/database";

import axios, { AxiosResponse } from "axios";
import { FindProductOptions } from "@/database/models/product";
import { ProductApiResponse } from "../api/products";

export interface Props {
  errorMessage?: string;

  contactInfo: ContactInfo;
  aboutUsFooter: string;
  initCategory: Category;
  categories: Category[];
  products: (Product | ProductGroup)[];
  initCondition: ListCondition;
}

export default function CategoryPage({
  errorMessage,
  contactInfo,
  aboutUsFooter,
  initCategory,
  categories,
  products,
  initCondition,
}: Props) {
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const router = useRouter();

  const { sortItems, sortedOrderItems, productsPerPage } = categoryConfig;

  const [curCategory, setCurCategory] = useState(initCategory);
  const [_products, setProducts] =
    useState<(Product | ProductGroup)[]>(products);
  const [condition, setCondition] = useState<ListCondition>(initCondition);

  useEffect(() => {
    const loadOptions: FindProductOptions = {
      type: "all",
      catSlug: curCategory.slug,
      sort: condition.sort!.value,
      sortedOrder: condition.sortedOrder!.value,
      limit: productsPerPage,
    };

    axios
      .post("/api/products", loadOptions)
      .then(({ data }: AxiosResponse<ProductApiResponse>) => {
        if (!data.success) {
          throw new Error(data.message);
        }

        if (!data.products) {
          throw new Error("Products not found");
        }

        setProducts(data.products);
      });
  }, [curCategory, condition]);

  const sortAndOrderOnChange = ({ sort, sortedOrder }: ListCondition) => {
    setCondition({ sort, sortedOrder });

    router.push(
      `/category/${curCategory.slug}?sort=${sort!.value}&sortedOrder=${
        sortedOrder!.value
      }`,
      undefined,
      { shallow: true }
    );
  };

  const onCategoryChange = (
    optionItem: ReturnType<typeof convertToOptionItem>
  ) => {
    const cat = categories.find((cat) => cat.slug === optionItem.value);

    if (!cat) {
      throw new Error("Category not found");
    }

    setCurCategory(cat);

    router.push(
      `/category/${cat.slug}?sort=${condition.sort!.value}&sortedOrder=${
        condition.sortedOrder!.value
      }`,
      undefined,
      { shallow: true }
    );
  };

  const loadMore = () => {
    if (_products.length === curCategory.numProducts) {
      return;
    }

    const loadOptions: FindProductOptions = {
      catSlug: curCategory.slug,
      sort: condition.sort!.value,
      sortedOrder: condition.sortedOrder!.value,
      limit: productsPerPage,
      offset: _products.length,
      type: "all",
    };

    axios.post("/api/products", loadOptions).then(({ data }) => {
      setProducts([..._products, ...data.products]);
    });
  };

  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <div className={styles.wrapper}>
        <aside className={styles.aside}>
          <CategoryInfo
            name={curCategory.name}
            image={curCategory.image}
            description={curCategory.description}
          />
          <SortAndOrder
            sortItems={sortItems}
            sortedOrderItems={sortedOrderItems}
            initCondition={initCondition}
            onChange={sortAndOrderOnChange}
          />
          <Select
            selectClass={styles.categorySelect}
            optionClass={styles.categoryOption}
            optionItems={categories.map(convertCategoryToOptionItem)}
            initOptionItem={convertCategoryToOptionItem(curCategory)}
            onChange={onCategoryChange}
          />
        </aside>
        <div className={styles.main}>
          <div className={styles.productList}>
            <ProductList products={_products} type="grid" />
          </div>
          <div className={styles.button}>
            {_products.length < curCategory.numProducts && (
              <ButtonCPN
                label="Load More"
                type="normal"
                onClick={loadMore}
                className={styles.loadMoreButton}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

CategoryPage.displayName = "Category";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { sort, sortedOrder } = context.query;
  const params = context.params as { slug: string };
  const { slug } = params;

  if (!sort || !sortedOrder) {
    return redirectToSortedPage(sort, sortedOrder, slug);
  }

  const sortItemIndex = categoryConfig.sortItems.findIndex(
    (item) => item.value === sort
  );
  const sortedOrderItemIndex = categoryConfig.sortedOrderItems.findIndex(
    (item) => item.value === sortedOrder
  );

  const sortItem =
    sortItemIndex !== -1
      ? categoryConfig.sortItems[sortItemIndex]
      : categoryConfig.sortItems[0];
  const sortedOrderItem =
    sortedOrderItemIndex !== -1
      ? categoryConfig.sortedOrderItems[sortedOrderItemIndex]
      : categoryConfig.sortedOrderItems[0];

  try {
    const [aboutUsRes, categoriesRes, productsRes] = await Promise.all([
      getAboutUsData(),
      getCategories(),
      getProducts({
        catSlug: slug,
        type: "all",
        limit: categoryConfig.productsPerPage,
      }),
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

    if (!productsRes.success) {
      return {
        props: {
          errorMessage: productsRes.message,
        },
      };
    }

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    const categories = categoriesRes.data;

    const initCategory = (categories as Category[]).find(
      (cat) => cat.slug === slug
    );

    if (!initCategory) {
      throw new Error("Category not found");
    }

    const products = productsRes.data;



    return {
      props: {
        contactInfo,
        aboutUsFooter,
        categories,
        initCategory,
        products,
        initCondition: {
          sort: sortItem,
          sortedOrder: sortedOrderItem,
        },
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

/****************************
 * Helper Functions
 */

const redirectToSortedPage = (
  sort: string | string[] | undefined,
  sortedOrder: string | string[] | undefined,
  slug: string
) => {
  let sortItemIndex = sort
    ? categoryConfig.sortItems.findIndex((item) => item.value === sort)
    : 0;
  let sortedOrderItemIndex = sortedOrder
    ? categoryConfig.sortedOrderItems.findIndex(
        (item) => item.value === sortedOrder
      )
    : 0;

  const sortItem =
    categoryConfig.sortItems[sortItemIndex === -1 ? 0 : sortItemIndex];
  const sortedOrderItem =
    categoryConfig.sortedOrderItems[
      sortedOrderItemIndex === -1 ? 0 : sortedOrderItemIndex
    ];

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
};

const convertCategoryToOptionItem = (category: Category) => {
  const getValue = (category: Category) => category.slug;
  const getLabel = (category: Category) => category.name;

  return convertToOptionItem({ item: category, getValue, getLabel });
};
