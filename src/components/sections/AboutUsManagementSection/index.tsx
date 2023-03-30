import RichTextEditorCPN from "@/components/basics/RichTextEditor";
import TextAreaBlockCPN from "@/components/basics/TextAreaBlock";
import ContactInfoManagement from "@/components/composites/ContactInfoManagement";
import styles from "@styles/sections/AboutUsManagementSection.module.scss";

import type { ContactInfo } from '@/types/others';

import {useEffect, useState} from 'react';

import axios from 'axios';

export interface Props {
}


export default function AboutUsManagementSection({ }: Props) {

    const [aboutUsFooterContent, setAboutUsFooterContent] = useState<string|null>(null);
    const [missionStatementContent, setMissionStatementContent] = useState<string|null>(null);
    const [historyContentHTML, setHistoryContentHTML] = useState<string|null>(null);
    const [contactInfo, setContactInfo] = useState<ContactInfo|null>(null);


    useEffect(() => {
        axios.get("/api/about-us")
            .then((res) => {               
                const { aboutUsFooter, missionStatement, historyHTML, contactInfo } = res.data;
                setAboutUsFooterContent(aboutUsFooter);
                setMissionStatementContent(missionStatement);
                setHistoryContentHTML(historyHTML);
                setContactInfo(contactInfo);
            });
    }, []);


    const aboutUsFooterOnSave = (content: string) => {
        axios.post("/api/about-us/?type=footer", {content})
            .then((res) => {  
                setAboutUsFooterContent(content);
            })
            .catch((err) => {
                throw err;
            });
    }

    const missionStatementOnSave = (content: string) => {
        axios.post("/api/about-us/?type=mission-statement", {content})
            .then((res) => {
                setMissionStatementContent(content);
            })
            .catch((err) => {
                throw err;
            });

    }

    const historyOnSave = (content: string) => {
        axios.post("/api/about-us/?type=history", {content})
            .then((res) => {
                setHistoryContentHTML(content);
            })
            .catch((err) => {
                throw err;
            });
    }

    const contactInfoOnSave = (email: string, phone: string, additionalInfos: string[]) => {

        axios.post("/api/about-us/?type=contact-info", {email, phone, additionalInfos})
            .then((res) => {
                setContactInfo({email, phone, additionalInfos});
            })
            .catch((err) => {
                throw err;
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
                <h3 className={styles.title}>CONTACT INFOS</h3>
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