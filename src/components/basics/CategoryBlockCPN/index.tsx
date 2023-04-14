import { FC } from "react";

import styles from "@styles/basics/CategoryBlockCPN.module.scss";
import ImageCPN from "@/components/basics/ImageCPN";
import { RemoteImage } from "@/types/image";

export interface Props {
  image: RemoteImage;
  name: string;
  description: string;
  detailed?: boolean;
  vertical?: boolean;
}

type CategoryBlock = FC<Props>;

const CategoryBlockCPN: CategoryBlock = ({
  image,
  name,
  description,
  detailed,
  vertical,
}) => {
  if (detailed) {
    return (
      <div className={styles.wrapper + " " + styles.detailed}>
        <ImageCPN image={image} size="medium" className={styles.image} />
        <div className={styles.text}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>
            {description.length > 90
              ? description.substring(0, 90) + " ..."
              : description}
          </p>
        </div>
      </div>
    );
  }

  if (vertical) {
    return (
      <div className={styles.wrapper + " " + styles.vertical}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ImageCPN image={image} size="medium" className={styles.image} />
      <div className={styles.text}>
        <h3 className={styles.name}>{name}</h3>
      </div>
    </div>
  );
};

export default CategoryBlockCPN;

CategoryBlockCPN.displayName = "CategoryBlockCPN";
