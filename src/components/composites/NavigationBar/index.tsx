import LinksList from "@/components/generics/LinksList";
import NavItemCPN from "@/components/basics/NavItemCPN";

import { navigationItems } from "@/config";

import styles from "@styles/composites/NavigationBar.module.scss";

interface Props {
    currentPage: string;
}


export default function NavigationBar({ currentPage }: Props) {

    const activeItemID = navigationItems.find((item) => item.path.toLowerCase() === currentPage.toLowerCase())?.id;

    return (
        <>
            <div className={styles.hamburgerMenu}>
                HamburgerMenu
            </div>
            <div className={styles.linksList}>
                <LinksList 
                    items={navigationItems}
                    ItemCPN={NavItemCPN}
                    liClass = {styles.li}
                    ulClass = {styles.ul}
                    linkClass = {styles.link}
                    activeItem = {activeItemID? {id: activeItemID, className: styles.current}: undefined}            
                    horizontal
                />
            </div>
        </>
    );
}