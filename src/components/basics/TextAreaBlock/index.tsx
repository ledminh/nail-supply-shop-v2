import { FC } from "react";

import ButtonCPN from "@components/basics/ButtonCPN";
import { useState, useEffect } from "react";

import styles from "@styles/basics/TextAreaBlockCPN.module.scss";

export interface Props {
  title: string;
  initContent: string;
  onSave: (content: string) => void;
}

type TextAreaBlock = FC<Props>;

const TextAreaBlockCPN: TextAreaBlock = ({ title, initContent, onSave }) => {
  const [content, setContent] = useState(initContent);

  useEffect(() => {
    setContent(initContent);
  }, [initContent]);

  return (
    <div className={styles.wrapper}>
      <label htmlFor={`text-area-${title}`} className={styles.label}>
        <h3>{title}</h3>
      </label>
      <textarea
        id={`text-area-${title}`}
        className={styles.textarea}
        placeholder={`Type your content for ${title} here ...`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={styles.buttons}>
        <ButtonCPN
          label={content === initContent ? "Saved" : "Save"}
          type="normal"
          onClick={() => onSave(content)}
          disabled={content === initContent}
        />
        <ButtonCPN
          label="Cancel"
          type="attention"
          onClick={() => setContent(initContent)}
        />
      </div>
    </div>
  );
};

export default TextAreaBlockCPN;

TextAreaBlockCPN.displayName = "TextAreaBlockCPN";
