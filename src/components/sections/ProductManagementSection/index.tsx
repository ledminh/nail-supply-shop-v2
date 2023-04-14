import List from "@/components/generics/List";
import styles from "@styles/sections/ProductManagementSection.module.scss";
import { Product, ProductGroup } from "@/types/product";

import { Dispatch, SetStateAction } from "react";

import axios, { AxiosResponse } from "axios";

import { useWarningModal } from "@/components/composites/WarningModal";

import { useState, useEffect } from "react";
import AdminProductBlockCPN from "@/components/basics/AdminProductBlock";
import AdminProductGroupBlockCPN from "@/components/basics/AdminProductGroupBlock";
import { useProductModal } from "@/components/composites/ProductModal";

import useDelete from "@/hooks/ProductManagementSection/useDelete";
import { useGroupModal } from "@/components/composites/ProductGroupModal";
import useEdit from "@hooks/ProductManagementSection/useEdit";

import isProduct from "@utils/isProduct";
import Select from "@/components/generics/Select";
import ButtonCPN from "@/components/basics/ButtonCPN";
import { Category } from "@/types/category";

import useCreate from "@hooks/ProductManagementSection/useCreate";

import { OptionItem, convertToOptionItem } from "@/components/generics/Select";
import { ProductApiResponse } from "@/pages/api/products";
import { FindProductOptions } from "@/database/models/product";
import { productManagementConfig } from "@/config";
import SortAndOrder from "@/components/composites/SortAndOrder";
import {
  ListCondition,
  SortType,
  SortedOrderType,
} from "@/types/list-conditions";

export interface Props {}

export default function ProductManagementSection({}: Props) {
  const { sortItems, sortedOrderItems } = productManagementConfig;

  const [reloadProducts, setReloadProducts] = useState<boolean>(false);

  const [products, setProducts] = useState<(Product | ProductGroup)[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [sortingCondition, setSortingCondition] = useState<ListCondition>({
    sort: sortItems[0],
    sortedOrder: sortedOrderItems[0],
  });

  const { showWarning, WarningModalComponent } = useWarningModal();
  const { openEditProduct, openCreateProduct, ProductModalComponent } =
    useProductModal();
  const { openEditGroup, openCreateGroup, GroupModalComponent } =
    useGroupModal();

  const { onDeleteProduct, onDeleteGroup } = useDelete({
    products,
    showWarning,
    setReloadProducts,
  });
  const { createProduct, createGroup } = useCreate({
    currentCategory,
    products,
    setProducts,
    openCreateProduct,
    openCreateGroup,
  });
  const { onEditProduct, onEditGroup } = useEdit({
    currentCategory,
    products,
    setProducts,
    openEditProduct,
    openEditGroup,
    setReloadProducts,
  });

  const ItemWrapper = getItemWrapper({
    onDeleteProduct,
    onDeleteGroup,
    onEditProduct,
    onEditGroup,
  });

  useEffect(() => {
    loadCategories().then((categories) => {
      setCategories(categories);
      setCurrentCategory(categories[0]);
    });
  }, []);

  useEffect(() => {
    if (currentCategory) {
      loadProducts(
        currentCategory.id,
        setProducts,
        0,
        sortingCondition.sort!.value,
        sortingCondition.sortedOrder!.value
      );
    }
  }, [currentCategory]);

  useEffect(() => {
    if (reloadProducts) {
      setReloadProducts(false);

      loadCategories().then((categories: Category[]) => {
        const oldCategory = categories.find(
          (c) => c.id === currentCategory?.id
        );
        setCategories(categories);
        if (oldCategory) {
          setCurrentCategory(oldCategory);
        } else {
          setCurrentCategory(categories[0]);
        }

        if (currentCategory)
          loadProducts(
            currentCategory.id,
            setProducts,
            0,
            sortingCondition.sort!.value,
            sortingCondition.sortedOrder!.value,
            products.length
          );
      });
    }
  }, [reloadProducts]);

  useEffect(() => {
    if (currentCategory) {
      loadProducts(
        currentCategory.id,
        setProducts,
        0,
        sortingCondition.sort!.value,
        sortingCondition.sortedOrder!.value
      );
    }
  }, [sortingCondition]);

  const loadMore = () => {
    if (products.length === currentCategory?.numProducts) return;

    loadProducts(
      currentCategory!.id,
      setProducts,
      products.length,
      sortingCondition.sort!.value,
      sortingCondition.sortedOrder!.value
    );
  };

  const sortAndOrderChange = (sortingCondition: ListCondition) => {
    setSortingCondition(sortingCondition);
  };

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.controls}>
          {categories.length !== 0 && currentCategory && (
            <Select
              selectClass={styles.controls_select}
              optionClass={styles.option}
              optionItems={categories.map(convertCategoryToOptionItem)}
              initOptionItem={convertCategoryToOptionItem(currentCategory)}
              onChange={(cat) => {
                const category = categories.find((c) => c.id === cat.value);
                if (category) {
                  setCurrentCategory(category);
                }
              }}
            />
          )}
          <SortAndOrder
            sortItems={sortItems}
            sortedOrderItems={sortedOrderItems}
            onChange={sortAndOrderChange}
            className={styles.sortAndOrder}
            fieldClassName={styles.sortAndOrder__field}
            initCondition={{
              sort: sortItems[0],
              sortedOrder: sortedOrderItems[0],
            }}
          />

          <div className={styles.buttons}>
            <ButtonCPN
              type="normal"
              label="Add Product"
              onClick={createProduct}
            />
            <ButtonCPN type="normal" label="Add Group" onClick={createGroup} />
          </div>
        </div>
        <List
          items={products}
          ItemCPN={ItemWrapper}
          liClass={styles.li}
          ulClass={styles.ul}
        />
        <div className={styles.loadMore}>
          {currentCategory &&
            products.length < currentCategory?.numProducts && (
              <ButtonCPN type="normal" label="Load More" onClick={loadMore} />
            )}
        </div>
      </section>
      <WarningModalComponent />
      <ProductModalComponent />
      <GroupModalComponent />
    </>
  );
}

ProductManagementSection.displayName = "ProductManagementSection";

/****************************
 * Helper functions
 */

async function loadCategories() {
  try {
    const res = await axios.get("/api/categories");

    if (!res.data.success) {
      throw new Error(res.data.message);
    }

    return res.data.categories;
  } catch (err) {
    throw err;
  }
}

const getLabel = (category: Category) => category.name;
const getValue = (category: Category) => category.id;

const convertCategoryToOptionItem = (
  category: Category
): OptionItem<Category> => {
  return convertToOptionItem({ item: category, getLabel, getValue });
};

async function loadProducts(
  catID: string,
  setProducts: Dispatch<SetStateAction<(Product | ProductGroup)[]>>,
  offset: number = 0,
  sort: SortType = "name",
  sortedOrder: SortedOrderType = "asc",
  limit: number = productManagementConfig.productsPerPage
) {
  const loadOptions: FindProductOptions = {
    type: "all",
    catID,
    sort,
    sortedOrder,
    limit,
    offset,
  };

  axios
    .post(`/api/products`, loadOptions)
    .then(({ data }: AxiosResponse<ProductApiResponse>) => {
      if (!data.success) {
        throw new Error(data.message);
      }

      if (!data.products) {
        throw new Error("No products found");
      }

      if (offset === 0) {
        setProducts(data.products);
        return;
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        return;
      }
    })
    .catch((err) => {
      throw err;
    });
}

type getItemWrapperProps = {
  onDeleteProduct: (productID: string) => void;
  onDeleteGroup: (groupID: string) => void;
  onEditGroup: (groupID: string) => void;
  onEditProduct: ({
    productID,
    groupID,
  }: {
    productID: string;
    groupID?: string;
  }) => void;
};

function getItemWrapper({
  onDeleteProduct,
  onDeleteGroup,
  onEditGroup,
  onEditProduct,
}: getItemWrapperProps) {
  const ItemWrapper = (product: Product | ProductGroup) => {
    return (
      <>
        {isProduct(product) ? (
          <AdminProductBlockCPN
            {...product}
            onDelete={onDeleteProduct}
            onClick={onEditProduct}
          />
        ) : (
          <AdminProductGroupBlockCPN
            {...product}
            onDelete={onDeleteGroup}
            onClick={onEditGroup}
            onEditProduct={(id) =>
              onEditProduct({ productID: id, groupID: product.id })
            }
          />
        )}
      </>
    );
  };

  return ItemWrapper;
}
