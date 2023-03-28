import RichTextEditorCPN from "@/components/basics/RichTextEditor";
import TextAreaBlockCPN from "@/components/basics/TextAreaBlock";
import ContactInfoManagement from "@/components/composites/ContactInfoManagement";
import styles from "@styles/sections/AboutUsManagementSection.module.scss";

import type { ContactInfos } from '@/types/others';

import {useState} from 'react';

import axios from 'axios';

export interface Props {
}


export default function AboutUsManagementSection({ }: Props) {

    const [aboutUsFooterContent, setAboutUsFooterContent] = useState<string|null>(null);
    const [missionStatementContent, setMissionStatementContent] = useState<string|null>(null);
    const [historyContentHTML, setHistoryContentHTML] = useState<string|null>(null);
    const [contactInfo, setContactInfo] = useState<ContactInfos|null>(null);


    const aboutUsFooterOnSave = (content: string) => {
        axios.post("/api/about-us/footer", {content})
            .then((res) => {
                console.log(res);
                // setAboutUsFooterContent(content);
            });
    }

    const missionStatementOnSave = (content: string) => {
        axios.post("/api/about-us/mission-statement", {content})
            .then((res) => {
                console.log(res);
                // setMissionStatementContent(content);
            });

    }

    const historyOnSave = (content: string) => {
        axios.post("/api/about-us/history", {content})
            .then((res) => {
                console.log(res);
                // setHistoryContentHTML(content);
            });
    }

    const contactInfoOnSave = (email: string, phone: string, additionalInfos: string[]) => {

        axios.post("/api/about-us/contact-info", {email, phone, additionalInfos})
            .then((res) => {
                console.log(res);
                setContactInfo({ email, phone, additionalInfos });
            });
    }



    return (
        <section className={styles.wrapper}>
            <section className={styles.aboutUsFooter}>
                <TextAreaBlockCPN
                    title = "ABOUT US (footer)"
                    initContent = {aboutUsFooterContent ?? ""}
                    onSave = {aboutUsFooterOnSave}
                />
            </section>
            <section className={styles.missionStatement}>
                <TextAreaBlockCPN
                    title = "MISSION STATEMENT"
                    initContent = {missionStatementContent ?? ""}
                    onSave = {missionStatementOnSave}
                />
            </section>
            <section className={styles.history}>
                <RichTextEditorCPN
                    title = "HISTORY"
                    initContent = {historyContentHTML ?? ""}
                    onSave = {historyOnSave}
                />
            </section>
            <section className={styles.contactInfoManagement}>
                <ContactInfoManagement
                    initialEmail = {contactInfo? contactInfo.email: ""} 
                    initialPhone = {contactInfo? contactInfo.phone: ""}
                    initialAdditionalInfos  = {contactInfo? contactInfo.additionalInfos: []}
                    onSave = {contactInfoOnSave}
                />
            </section>

        </section>
    );
}

AboutUsManagementSection.displayName = "AboutUsManagementSection";