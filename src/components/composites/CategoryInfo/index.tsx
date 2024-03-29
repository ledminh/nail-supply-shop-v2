import { RemoteImage } from "@/types/image";
import styles from "@styles/composites/CategoryInfo.module.scss";

import ImageCPN from "@components/basics/ImageCPN";
import { useEffect, useState } from "react";

export interface Props {
  name: string;
  description: string;
  image: RemoteImage;
}

export default function CategoryInfo({ name, image, description }: Props) {
  const [showReadMore, setShowReadMore] = useState(false);
  const [_description, setDescription] = useState(description);

  useEffect(() => {
    if (description.length > 100) {
      setDescription(description.substring(0, 100) + "...");
    } else {
      setDescription(description);
    }
  }, [description]);

  const handleReadMore = () => {
    if (showReadMore) {
      setDescription(description.substring(0, 100) + "...");
    } else {
      setDescription(description);
    }
    setShowReadMore(!showReadMore);
  };

  return (
    <div className={styles.wrapper}>
      <ImageCPN image={image} className={styles.image} size="medium" />
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{_description}</p>
        <button className={styles.readmore} onClick={handleReadMore}>
          {description.length > 100
            ? showReadMore
              ? "Read less"
              : "Read more"
            : null}
        </button>
      </div>
    </div>
  );
}

CategoryInfo.displayName = "CategoryInfo";
