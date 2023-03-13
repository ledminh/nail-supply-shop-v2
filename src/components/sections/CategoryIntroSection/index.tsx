import BannerCPN from "@/components/basics/BannerCPN";
import CategoryList from "@/components/composites/CategoryList";
import styles from "@styles/sections/CategoryIntroSection.module.scss";

import Link from "next/link";

import type { Category } from "@/types/category";

export interface Props {
    categoryIntro: string;
    categories: Category[];
}


export default function CategoryIntroSection({ categoryIntro, categories }: Props) {


    return (
        <section className={styles.wrapper}>
            <div className={styles.banner}>
                <BannerCPN 
                    text={categoryIntro}
                />
            </div>
            <div className={styles.list}>
                <CategoryList 
                    categories={categories}
                />
            </div>
            <div className={styles.footer}>
                <Link
                    className={styles.link}
                    href="/shop">
                    View All
                </Link>
            </div>
        </section>
    );
}

CategoryIntroSection.displayName = "CategoryIntroSection";