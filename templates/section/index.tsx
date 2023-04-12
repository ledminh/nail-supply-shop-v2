import styles from "@styles/sections/templatenameSection.module.scss";

export interface Props {}

export default function templatenameSection({}: Props) {
  return <section className={styles.placeholder}>TemplateName Section</section>;
}

templatenameSection.displayName = "templatenameSection";
