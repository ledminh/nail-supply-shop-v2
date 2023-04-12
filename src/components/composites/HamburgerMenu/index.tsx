import styles from "@styles/composites/HamburgerMenu.module.scss";

import { useState, useEffect } from "react";

import ButtonCPN from "@components/basics/ButtonCPN";
import ImageCPN from "@/components/basics/ImageCPN";
import hamburgerIconSVG from "@images/hamburger_icon.svg";
import LinksList from "@components/generics/LinksList";
import { NavigationItem } from "@/types/item";

export interface Props {
  navigationItems: NavigationItem[];
  currentPage: string;
}

import NavItemCPN from "@components/basics/NavItemCPN";

export default function HamburgerMenu({ navigationItems, currentPage }: Props) {
  const activeItemID = navigationItems.find(
    (item) => item.path.toLowerCase() === currentPage.toLowerCase()
  )?.id;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <div className={styles.wrapper}>
      <ButtonCPN
        type="normal"
        label="Menu"
        className={styles.button}
        icon={{
          position: "left",
          Node: <HamburgerIcon />,
        }}
        onClick={() => setIsMenuOpen(true)}
      />
      <div
        className={styles.overlay + " " + (isMenuOpen ? styles.open : "")}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className={styles.menu}>
          <LinksList
            items={navigationItems}
            ItemCPN={NavItemCPN}
            liClass={styles.li}
            ulClass={styles.ul}
            linkClass={styles.link}
            activeItem={
              activeItemID
                ? { id: activeItemID, className: styles.current }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

HamburgerMenu.displayName = "HamburgerMenu";

const HamburgerIcon = () => {
  return (
    <ImageCPN
      image={{
        src: hamburgerIconSVG,
        alt: "Hamburger Icon",
      }}
      size="small"
      className={styles.hamburgerIcon}
    />
  );
};
