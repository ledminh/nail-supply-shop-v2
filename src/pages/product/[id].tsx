import { GetServerSideProps } from "next";

import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import { ContactInfo } from "@/types/others";
import Link from "next/link";

import { Category } from "@/types/category";
import getCategoryProps from "@/utils/getCategoryProps";

import styles from "@/styles/pages/Product.module.scss";
import ImagesCarousellSection from "@/components/sections/ImagesCarousell";
import ProductInfo from "@/components/composites/ProductInfo";
import ButtonCPN from "@/components/basics/ButtonCPN";
import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import { ProductImage } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

import {
  getProducts,
  getProduct,
  getCategories,
  getAboutUsData,
} from "@/database";

export interface Props {
  errorMessage?: string;

  contactInfo: ContactInfo;
  aboutUsFooter: string;
  productID: string;
  images: ProductImage[];
  name: string;
  intro: string;
  details: string;
  price: number;

  categoryID: string;

  groupName?: string;
  otherProducts?: Product[];
  categories: Category[];
}

export default function ProductPage({
  errorMessage,
  productID,
  contactInfo,
  aboutUsFooter,
  images,
  name,
  intro,
  groupName,
  otherProducts,
  price,
  categoryID,
  details,
  categories,
}: Props) {
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const router = useRouter();
  const [quantity, setQuantity] = useState(0);

  const { addToCart } = useCart();


  const catProps = getCategoryProps({
    categories,
    categoryID,
    props: ["name", "slug"],
  });

  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <div className={styles.wrapper}>
        <ImagesCarousellSection images={images} />
        <section className={styles.productInfo}>
          <ProductInfo
            name={name}
            intro={intro}
            groupName={groupName}
            otherProducts={otherProducts}
            className={styles.text}
            onChange={(selectedProduct) => {
              router.push(`/product/${selectedProduct.id}`);
            }}
          />
          <div className={styles.footer}>
            <h3 className={styles.price}>{price}</h3>
            <div className={styles.addToCart}>
              <ButtonCPN
                type="normal"
                label="Add to Cart"
                className={styles.addToCartButton}
                onClick={() => {
                  addToCart({
                    id: productID,
                    name: name,
                    price: price,
                    quantity: quantity,
                    image: images[0],
                  });

                  setQuantity(0);
                  router.push("/cart");
                }}
              />
              <QuantityPickerCPN
                value={quantity}
                onChange={(q) => {
                  setQuantity(q);
                }}
                buttonClassName={styles.quantityButton}
                valueClassName={styles.quantityValue}
                className={styles.quantityPicker}
              />
            </div>
          </div>
          {catProps && (
            <div className={styles.category}>
              <h4 className={styles.label}>Category:</h4>
              <Link
                href={`/category/${catProps.slug}`}
                className={styles.categoryLink}
              >
                <span>{catProps.name}</span>
              </Link>
            </div>
          )}
        </section>
        <section className={styles.details}>
          <h3 className={styles.title}>Details</h3>
          <p>{details}</p>
        </section>
      </div>
    </PageLayout>
  );
}

ProductPage.displayName = "ProductPage";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const [aboutUsRes, productRes, categoriesRes] = await Promise.all([
      getAboutUsData(),
      getProduct({ id }),
      getCategories(),
    ]);

    if (!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message,
        },
      };
    }

    if (!productRes.success) {
      return {
        props: {
          errorMessage: productRes.message,
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
    const product = productRes.data as Product;
    const categories = categoriesRes.data;

    
    if (!product.groupID) {
      return {
        props: {
          contactInfo,
          aboutUsFooter,
          productID: id,
          images: product.images,
          name: product.name,
          intro: product.intro,
          details: product.details,
          price: product.price,

          categoryID: product.categoryID,
          categories,
        },
      };
    }

    const otherProductsRes = await getProducts({
      groupID: product.groupID,
      type: "product",
    });

    if (!otherProductsRes.success) {
      return {
        props: {
          errorMessage: otherProductsRes.message,
        },
      };
    }

    const otherProducts = (otherProductsRes.data as Product[]).filter(
      (p: Product) => p.id !== product.id
    );

    return {
      props: {
        contactInfo,
        aboutUsFooter,
        productID: id,
        images: product.images,
        name: product.name,
        intro: product.intro,
        details: product.details,
        price: product.price,

        categoryID: product.categoryID,
        categories,
        groupID: product.groupID,
        otherProducts,
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
