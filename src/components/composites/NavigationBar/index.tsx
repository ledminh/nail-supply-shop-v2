import LinksList from "@/components/generics/LinksList";
import NavItemCPN from "@/components/basics/NavItemCPN";

import { navigationItems } from "@/config";

import styles from "@styles/composites/NavigationBar.module.scss";
import HamburgerMenu from "@components/composites/HamburgerMenu";

interface Props {
  currentPage: string;
  numberOfItemsInCart?: number;
}

export default function NavigationBar({
  currentPage,
  numberOfItemsInCart,
}: Props) {
  const activeItemID = navigationItems.find(
    (item) => item.path.toLowerCase() === currentPage.toLowerCase()
  )?.id;

  const _navigationItems = navigationItems.map((item) => {
    if (item.label === "Cart") {
      return {
        ...item,
        label: `${item.label} ${
          numberOfItemsInCart && numberOfItemsInCart > 0
            ? `(${numberOfItemsInCart})`
            : ""
        }`,
      };
    }
    return item;
  });

  return (
    <>
      <div className={styles.hamburgerMenu}>
        <HamburgerMenu
          navigationItems={_navigationItems}
          currentPage={currentPage}
        />
      </div>
      <div className={styles.linksList}>
        <LinksList
          items={_navigationItems}
          ItemCPN={NavItemCPN}
          liClass={styles.li}
          ulClass={styles.ul}
          linkClass={styles.link}
          activeItem={
            activeItemID
              ? { id: activeItemID, className: styles.current }
              : undefined
          }
          horizontal
        />
      </div>
    </>
  );
}
