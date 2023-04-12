import { FC } from "react";

import styles from "@styles/basics/SeparatorCPN.module.scss";

export interface Props {}

type Separator = FC<Props>;

const SeparatorCPN: Separator = ({}) => {
  return <div className={styles.separator} />;
};

export default SeparatorCPN;

SeparatorCPN.displayName = "SeparatorCPN";
