import { WebsiteTitle } from "@/types/others";
import styles from "@styles/basics/WebsiteTitleCPN.module.scss";
import ImageCPN from "@components/basics/ImageCPN";

export type Props = WebsiteTitle;

export default function WebsiteTitleCPN(props: Props) {
  return (
    <div className={styles.wrapper}>
      {props.image ? (
        <ImageCPN image={props.image} size="medium" className={styles.image} />
      ) : (
        <>
          <h1 className={styles.title}>{props.title}</h1>
          <h3 className={styles.subtitle}>{props.subtitle}</h3>
        </>
      )}
    </div>
  );
}
