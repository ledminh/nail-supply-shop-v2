import { FC } from "react";

import NavigationBar from "@components/composites/NavigationBar";
import WebsiteTitleCPN from "@components/basics/WebsiteTitleCPN";
import SearchBar from "@components/composites/SearchBar";

import { websiteTitle } from "@/config";
import styles from "@styles/sections/HeaderSection.module.scss";
import SeparatorCPN from "@/components/basics/SeparatorCPN";

import CartContext from "@/contexts/CartContext";



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
                <CartContext.Consumer>
                    {({cart}) => (
                        <NavigationBar currentPage={currentPage} numberOfItemsInCart={cart.reduce((acc, item) => acc + item.quantity, 0)}/>
                    )}
                </CartContext.Consumer>
            </div>
            <div className={styles.separator}>
                <SeparatorCPN/>
            </div>
        </section>
    );
}

export default HeaderSection;

HeaderSection.displayName = "HeaderSection";