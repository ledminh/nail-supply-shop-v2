import { FC } from "react";

import ButtonCPN from "@components/basics/ButtonCPN";
import { useState, useMemo } from "react";


import styles from "@styles/basics/RichTextEditorCPN.module.scss";

import '@styles/customized-quill.scss';

import ReactQuill from 'react-quill';


export interface Props  {
    title: string;
    initContent: string;
    onSave: (content: string) => void;

};

type RichTextEditor = FC<Props>;


const RichTextEditorCPN:RichTextEditor = ({title, initContent, onSave}) => {

    const [content, setContent] = useState(initContent);


    return (
        <div className={styles.wrapper}>
            <label htmlFor={`text-area-${title}`} className={styles.label}><h3>{title}</h3></label>
            <ReactQuill id={`text-area-${title}`}
                    theme="snow"
                    placeholder={`Type your content for ${title} here ...`}
                    value = {content}
                    onChange = {(value) => setContent(value)}
                />
            <div className={styles.buttons}>
                <ButtonCPN label="Save" 
                        type="normal"
                        onClick={() => onSave(content)}
                    />
                <ButtonCPN label="Cancel" 
                        type="attention"
                        onClick={() => setContent(initContent)}
                    />
            </div>
        </div>
    );
}

export default RichTextEditorCPN;

RichTextEditorCPN.displayName = "TextAreaBlockCPN";