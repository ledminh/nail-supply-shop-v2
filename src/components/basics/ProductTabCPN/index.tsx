import { FC } from "react";

import styles from "@styles/basics/ProductTabCPN.module.scss";
import type { Product, ProductGroup } from "@/types/product";

import ImageCPN from "@/components/basics/ImageCPN";

// No detailed option for ProductGroup
type Props =
  | (ProductGroup & {
      detailed?: false;
    })
  | (Product & {
      detailed?: boolean;
    });

type ProductTab = FC<Props>;

const ProductTabCPN: ProductTab = (props) => {
  if (!props.detailed) {
    return (
      <div className={styles.wrapper}>
        <span>{props.name}</span>
      </div>
    );
  }

  const { name, price, intro, images } = props;

  let _intro = intro;

  if (intro.length > 80) {
    _intro = intro.slice(0, 80) + "...";
  }

  return (
    <div className={styles.wrapper + " " + styles.detailed}>
      <ImageCPN
        image={images[0]}
        size="small"
        className={styles.image + " " + styles.detailed}
      />
      <div className={styles.text + " " + styles.detailed}>
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.price}>{price}</p>
        <p className={styles.intro}>{_intro}</p>
      </div>
    </div>
  );
};

export default ProductTabCPN;

ProductTabCPN.displayName = "ProductTabCPN";
