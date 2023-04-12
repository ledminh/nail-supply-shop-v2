import { FC } from "react";

import styles from "@styles/basics/templatenameCPN.module.scss";

export interface Props {}

type templatename = FC<Props>;

const templatenameCPN: templatename = ({}) => {
  return <div className={styles.placeholder}>TemplateName component</div>;
};

export default templatenameCPN;

templatenameCPN.displayName = "templatenameCPN";
