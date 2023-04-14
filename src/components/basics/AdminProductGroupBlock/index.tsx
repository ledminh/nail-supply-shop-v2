import { FC } from "react";
import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";

import type { Product, ProductGroup } from "@/types/product";
import styles from "@styles/basics/AdminProductGroupBlockCPN.module.scss";

import { useState } from "react";

import Select from "@/components/generics/Select";

import { convertToOptionItem, OptionItem } from "@/components/generics/Select";

export interface Props extends ProductGroup {
  onDelete: (productID: string) => void;
  onClick: (productID: string) => void;
  className?: string;

  onEditProduct: (id: string) => void;
}

type AdminProductGroupBlock = FC<Props>;

const AdminProductGroupBlockCPN: AdminProductGroupBlock = ({
  id,
  name,
  products,
  onDelete,
  onClick,
  className,
  onEditProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const classNames = [styles.wrapper, className].join(" ");

  const onSelect = (selectedOption: OptionItem<Product>) => {
    const curProduct = products.find((p) => p.id === selectedOption.id);

    if (curProduct) {
      setSelectedProduct(curProduct);
    }
  };

  const productOptions = getProductOptions(products);

  return (
    <div
      className={classNames}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(id);
      }}
    >
      <ImageCPN
        image={selectedProduct.images[0]}
        size="medium"
        className={styles.image}
      />
      <div className={styles.text}>
        <h3 className={styles.name}>{name}</h3>
        <h4 className={styles.name}>{name}</h4>
        <div
          className={styles.productSelector}
        >
          <Select
            optionItems={productOptions}
            onChange={onSelect}
            selectClass={styles.select}
            initOptionItem={productOptions.find(
              (p) => p.id === selectedProduct.id
            )}
          />
          <ButtonCPN
            type="normal"
            label="Edit Product"
            className={styles.editProductButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEditProduct(selectedProduct.id);
            }}
          />
        </div>
        <h3 className={styles.price}>{selectedProduct.price}</h3>
        <h4 className={styles.price}>{selectedProduct.price}</h4>
        <p className={styles.description}>{selectedProduct.intro}</p>
      </div>
      <ButtonCPN
        type="danger"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onDelete(id);
        }}
        label="Delete"
        className={styles.deleteButton}
      />
    </div>
  );
};

export default AdminProductGroupBlockCPN;

AdminProductGroupBlockCPN.displayName = "AdminProductGroupBlockCPN";

/*******************
 * Helpers
 */

function getProductOptions(products: Product[]): OptionItem<Product>[] {
  const getValue = (product: Product) => {
    return product.id;
  };

  const getLabel = (product: Product) => {
    return product.name;
  };

  return products.map((product) =>
    convertToOptionItem({ item: product, getValue, getLabel })
  );
}
