import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from '@styles/layouts/TabLayout.module.scss';

interface Tab {
    name: string;
    slug: string;
}

interface TabLayoutProps {
    tabs: Tab[];
    currentTabSlug: string;
    children: ReactNode;
}

export default function TabLayout(props: TabLayoutProps) {
    const { tabs, currentTabSlug, children } = props;

    const tabLinks = tabs.map((tab) => (
        <Link key={tab.slug} href={`/admin/${tab.slug}`}
            className={`${styles.tab} ${tab.slug === currentTabSlug ? styles.currentTab : ''}`}
        >
            {tab.name}
        </Link>
    ));

    return (
        <div className={styles.wrapper}>
            <div className={styles.tabs}>{tabLinks}</div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
