import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import styles from "@styles/composites/ProductGroupBlock.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";

import type { Product, OrderedProduct } from "@/types/product";

import { useState, MouseEventHandler, useEffect, useRef } from "react";
import Select, {
  convertToOptionItem,
  OptionItem,
} from "@/components/generics/Select";

export interface Props {
  id: string;
  name: string;
  products: Product[];
  onPathChange?: (newPath: string) => void;
  addToCart: (orderedProduct: OrderedProduct) => void;
  setInitQuantity: (id: string, quantity: number) => void;
  initQuantities: Record<string, number>;
  initSelectedProductID: string;
  setInitSelectedProductID: (id: string, selectedProductID: string) => void;
}

export default function ProductGroupBlock({
  id,
  name,
  products,
  onPathChange,
  addToCart,
  setInitQuantity,
  initQuantities,
  initSelectedProductID,
  setInitSelectedProductID,
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState(
    products.find((p) => p.id === initSelectedProductID) || products[0]
  );

  const [quantity, setQuantity] = useState(initQuantities[selectedProduct.id]);

  useEffect(() => {
    if (onPathChange) {
      onPathChange(`/product/${selectedProduct.id}`);
    }

    setQuantity(initQuantities[selectedProduct.id] || 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  const onAdd: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity <= 0) return;

    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      image: selectedProduct.images[0],
    });

    setQuantity(0);
    setInitQuantity(selectedProduct.id, 0);
  };

  const onSelect = (selectedOption: OptionItem<Product>) => {
    const curProduct = products.find((p) => p.id === selectedOption.id);

    if (curProduct) {
      setSelectedProduct(curProduct);
      setInitSelectedProductID(id, curProduct.id);
    }
  };

  const productOptions = getProductOptions(products);

  return (
    <div
      className={
        styles.wrapper + (quantity > 0 ? " " + styles.highLighted : "")
      }
    >
      <ImageCPN
        image={selectedProduct.images[0]}
        size="medium"
        className={styles.image}
      />
      <div className={styles.text}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.price}>{selectedProduct.price}</p>
        <Select
          optionItems={productOptions}
          onChange={onSelect}
          selectClass={styles.select}
          initOptionItem={productOptions.find(
            (p) => p.id === selectedProduct.id
          )}
        />
        <div className={styles.controls}>
          <ButtonCPN
            type="normal"
            label="ADD TO CART"
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd(e);
            }}
            disabled={quantity === 0}
          />
          <QuantityPickerCPN
            value={quantity}
            onChange={(q) => {
              setQuantity(q);
              setInitQuantity(selectedProduct.id, q);
            }}
            buttonClassName={styles.quantityButton}
            valueClassName={styles.quantityValue}
            className={styles.quantityPicker}
          />
        </div>
      </div>
    </div>
  );
}

ProductGroupBlock.displayName = "ProductBlock";

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
