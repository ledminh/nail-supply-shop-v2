import { FC } from "react";

import ButtonCPN from "@components/basics/ButtonCPN";
import { useState, useCallback, useMemo, useEffect } from "react";

import styles from "@styles/basics/RichTextEditorCPN.module.scss";

import dynamic from "next/dynamic";

export interface Props {
  title: string;
  initContent: string;
  onSave: (content: string) => void;
}

type RichTextEditor = FC<Props>;

const RichTextEditorCPN: RichTextEditor = ({ title, initContent, onSave }) => {
  const [content, setContent] = useState(initContent);

  useEffect(() => {
    setContent(initContent);
  }, [initContent]);

  const ReactQuill = useMemo(() => {
    return dynamic(() => import("react-quill"), {
      ssr: false,
      loading: () => <p>Loading ...</p>,
    });
  }, []);

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  return (
    <div className={styles.wrapper}>
      <label htmlFor={`text-area-${title}`} className={styles.label}>
        <h3>{title}</h3>
      </label>
      <ReactQuill
        id={`text-area-${title}`}
        theme="snow"
        placeholder={`Type your content for ${title} here ...`}
        value={content}
        onChange={handleChange}
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

export default RichTextEditorCPN;

RichTextEditorCPN.displayName = "TextAreaBlockCPN";
