import InfoBlockLayout from "@/components/layouts/InfoBlockLayout";
import styles from "@styles/composites/ContactBlock.module.scss";

export interface Props {
  email: string;
  phone: string;
  additionalInfos: string[];
}

export default function ContactBlock({ email, phone, additionalInfos }: Props) {
  return (
    <InfoBlockLayout title={"Contact Us"}>
      <ul>
        <li key="email">
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{email}</span>
        </li>
        <li key="phone">
          <span className={styles.label}>Phone:</span>
          <span className={styles.value}>{phone}</span>
        </li>
        {additionalInfos.map((info) => {
          return (
            <li key={info}>
              <span className={styles.value}>{info}</span>
            </li>
          );
        })}
      </ul>
    </InfoBlockLayout>
  );
}

ContactBlock.displayName = "ContactBlock";
