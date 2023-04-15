import QuantityPickerCPN from "@/components/basics/QuantityPicker";
import styles from "@styles/composites/ProductBlock.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import ButtonCPN from "@components/basics/ButtonCPN";
import { RemoteImage } from "@/types/image";

import { useState, memo, useCallback } from "react";

import { OrderedProduct } from "@/types/product";

export interface Props {
  id: string;
  name: string;
  price: number;
  images: RemoteImage[];
  addToCart: (orderedProduct: OrderedProduct) => void;
  setInitQuantity: (id: string, quantity: number) => void;
  initQuantities: Record<string, number>;
}

function ProductBlock({
  id,
  name,
  price,
  images,
  addToCart,
  setInitQuantity,
  initQuantities,
}: Props) {
  const [quantity, setQuantity] = useState(initQuantities[id] || 0);

  const onAdd = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (quantity === 0) return;

      addToCart({
        id: id,
        name: name,
        price: price,
        quantity: quantity,
        image: images[0],
      });

      setQuantity(0);
      setInitQuantity(id, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quantity]);

  return (
    <div
      className={
        styles.wrapper + (quantity > 0 ? " " + styles.highLighted : "")
      }
    >
      <ImageCPN image={images[0]} size="medium" className={styles.image} />

      <div className={styles.text}>
        <p className={styles.price}>{price}</p>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.controls}>
          <ButtonCPN
            type="normal"
            label="ADD TO CART"
            className={styles.button}
            onClick={onAdd}
            disabled={quantity === 0}
          />
          <QuantityPickerCPN
            value={quantity}
            onChange={(q) => {
              setQuantity(q);
              setInitQuantity(id, q);
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

export default memo(ProductBlock);

ProductBlock.displayName = "ProductBlock";
