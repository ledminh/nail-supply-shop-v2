import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import styles from '@styles/layouts/TabLayout.module.scss';

import Select, { convertToOptionItem } from '@/components/generics/Select';

interface Tab {
    name: string;
    slug: string;
}

export interface TabLayoutProps {
    tabs: Tab[];
    currentTabSlug: string;
    children: ReactNode;
}

export default function TabLayout(props: TabLayoutProps) {
    const { tabs, currentTabSlug, children } = props;

    const router = useRouter();

    const tabLinks = tabs.map((tab) => (
        <Link key={tab.slug} href={`/admin/${tab.slug}`}
            className={`${styles.tab} ${tab.slug === currentTabSlug ? styles.currentTab : ''}`}
        >
            {tab.name}
        </Link>
    ));



    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.tabs}>{tabLinks}</div>
                <Select 
                    selectClass = {styles.select}
                    optionClass = {styles.option}
                    optionItems = {tabs.map(convertTabToOption)}
                    initOptionItem = {convertTabToOption(tabs.find((tab) => tab.slug === currentTabSlug)?? tabs[0])}
                    onChange = {(optionItem) => router.push(`/admin/${optionItem.value}`)}
                    />
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}


TabLayout.displayName = 'TabLayout';

const getValue = (tab: Tab) => tab.slug;
const getLabel = (tab: Tab) => tab.name;

const convertTabToOption = (tab: Tab) => {
    return convertToOptionItem({item: tab, getValue, getLabel});
}