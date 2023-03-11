import { FC } from "react";

import NavigationBar from "@components/composites/NavigationBar";
import WebsiteTitleCPN from "@components/basics/WebsiteTitleCPN";
import SearchBar from "@components/composites/SearchBar";

import { websiteTitle } from "@/config";
import styles from "@styles/sections/HeaderSection.module.scss";



export interface Props  {
    currentPage: string;
    onSearchSubmit: (query: string) => void;
};

type Header = FC<Props>;


const HeaderSection:Header = ({currentPage, onSearchSubmit}) => {


    return (
        <section className={styles.header}>
            <div className={styles.websiteTitle}>
                <WebsiteTitleCPN {...websiteTitle} />
            </div>
            <div className={styles.searchBar}>
                <SearchBar onSearchSubmit={onSearchSubmit}/>
            </div>
            <div className={styles.navBar}>
                <NavigationBar currentPage={currentPage} />
            </div>
        </section>
    );
}

export default HeaderSection;

HeaderSection.displayName = "HeaderSection";