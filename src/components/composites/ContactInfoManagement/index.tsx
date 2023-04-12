import ButtonCPN from "@/components/basics/ButtonCPN";
import styles from "@styles/composites/ContactInfoManagement.module.scss";

import { useState, useEffect } from "react";

export interface Props {
  initialEmail?: string;
  initialPhone?: string;
  initialAdditionalInfos?: string[];
  onSave?: (email: string, phone: string, additionalInfos: string[]) => void;
}

export default function ContactInfoManagement({
  initialEmail,
  initialPhone,
  initialAdditionalInfos,
  onSave,
}: Props) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [additionalInfos, setAdditionalInfos] = useState<string[]>(
    initialAdditionalInfos || []
  );

  useEffect(() => {
    setEmail(initialEmail ?? "");
    setPhone(initialPhone ?? "");
    setAdditionalInfos(initialAdditionalInfos || []);
  }, [initialEmail, initialPhone, initialAdditionalInfos]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.field}>
        <label htmlFor="email">EMAIL </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone">PHONE </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className={styles.field + " " + styles.additionalInfos}>
        <label htmlFor="additionalInfo">ADDITIONAL INFOS </label>
        {additionalInfos.map((info, index) => (
          <div key={index} className={styles.additionalInfo}>
            <input
              type="text"
              id="additionalInfo"
              value={info}
              onChange={(e) => {
                const newInfos = [...additionalInfos];
                newInfos[index] = e.target.value;
                setAdditionalInfos(newInfos);
              }}
            />
            <ButtonCPN
              type="attention"
              label="REMOVE"
              onClick={() => {
                const newInfos = [...additionalInfos];
                newInfos.splice(index, 1);
                setAdditionalInfos(newInfos);
              }}
              className={styles.button}
            />
          </div>
        ))}
        <ButtonCPN
          type="normal"
          label="ADD INFO"
          onClick={() => {
            setAdditionalInfos([...additionalInfos, ""]);
          }}
          className={styles.button}
        />
      </div>
      <div className={styles.field + " " + styles.buttons}>
        <ButtonCPN
          type="normal"
          label={
            email === initialEmail &&
            phone === initialPhone &&
            additionalInfos === initialAdditionalInfos
              ? "SAVED"
              : "SAVE"
          }
          onClick={() => {
            onSave && onSave(email, phone, additionalInfos);
          }}
          className={styles.button}
          disabled={
            email === initialEmail &&
            phone === initialPhone &&
            additionalInfos === initialAdditionalInfos
          }
        />
        <ButtonCPN
          type="attention"
          label="RESET"
          onClick={() => {
            setEmail(initialEmail ?? "");
            setPhone(initialPhone ?? "");
            setAdditionalInfos(initialAdditionalInfos || []);
          }}
          className={styles.button}
        />
      </div>
    </div>
  );
}

ContactInfoManagement.displayName = "ContactInfoManagement";
