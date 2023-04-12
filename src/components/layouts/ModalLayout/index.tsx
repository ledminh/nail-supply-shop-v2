import styles from "@styles/layouts/ModalLayout.module.scss";
import { useEffect } from "react";

export interface Props {
  title: string;
  children: React.ReactNode;
  FooterComponent: React.FC;
  type: "normal" | "warning";
}

export default function ModalLayout({
  title,
  children,
  FooterComponent,
  type,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const modalClassNames = [styles.modal, styles[type]].join(" ");
  const headerClassNames = [styles.header, styles[type]].join(" ");

  return (
    <div className={styles.overlay}>
      <div className={modalClassNames}>
        <div className={headerClassNames}>
          <div className={styles.title}>
            <h3>{title}</h3>
          </div>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <FooterComponent />
        </div>
      </div>
    </div>
  );
}
