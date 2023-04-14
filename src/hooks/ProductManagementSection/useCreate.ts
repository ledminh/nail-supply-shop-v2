import { Dispatch, SetStateAction } from "react";

import { Product, ProductGroup } from "@/types/product";
import { OpenCreateProductProps } from "@/components/composites/ProductModal";
import { OpenCreateGroupProps } from "@/components/composites/ProductGroupModal";
import createFormData from "@/utils/createFormData";

import processImages from "@/utils/processImages";

import axios from "axios";
import { Category } from "@/types/category";

type Props = {
  products: (Product | ProductGroup)[];
  currentCategory: Category | null;
  setProducts: Dispatch<SetStateAction<(Product | ProductGroup)[]>>;
  openCreateProduct: (props: OpenCreateProductProps) => void;
  openCreateGroup: (props: OpenCreateGroupProps) => void;
};

export default function useCreate({ products, currentCategory, setProducts, openCreateProduct, openCreateGroup }: Props) {
  const post = (url: string, formData: FormData) => {
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        if (data.success) setProducts([data.product, ...products]);
        else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  /***********************************
   * Public functions
   */

  const createProduct = () => {
    openCreateProduct({
      onSave({ serialNumber, name, intro, details, price, images }) {
        async function createProduct() {
          const processedImages = await processImages(images);
          const categoryID = currentCategory!.id;

          const formData = createFormData({
            serialNumber,
            categoryID,
            name,
            intro,
            details,
            price,
            images: JSON.stringify(processedImages),
          });

          post("/api/admin/products?type=add-product", formData);
        }

        createProduct();
      },
    });
  };

  const createGroup = () => {
    openCreateGroup({
      categoryID: currentCategory!.id,

      onSave({ name, products }) {
        // definition
        async function createGroup() {
          const uploadPromises = products.map((product) =>
            processImages(product.images)
          );

          const processedImagesArr = await Promise.all(uploadPromises);

          const processedProducts = processedImagesArr.map((image, index) => ({
            ...products[index],
            images: image,
          }));

          const categoryID = currentCategory!.id;

          const formData = createFormData({
            name,
            categoryID,
            products: JSON.stringify(processedProducts),
          });

          post("/api/admin/products?type=add-group", formData);
        }

        // execution
        createGroup();
      },
    });
  };

  return {
    createProduct,
    createGroup,
  };
}
