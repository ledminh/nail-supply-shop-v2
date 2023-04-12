import { FC } from "react";

import styles from "@styles/basics/BannerCPN.module.scss";

export interface Props {
  text: string;
}

type Banner = FC<Props>;

const BannerCPN: Banner = ({ text }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.text}>{text}</h2>
    </div>
  );
};

export default BannerCPN;

BannerCPN.displayName = "BannerCPN";
