import FooterSection from '@/components/sections/FooterSection';
import HeaderSection from '@/components/sections/HeaderSection';
import styles from '@styles/layouts/PageLayout.module.scss';

import type { ContactInfo } from '@/types/others';

import { useRouter } from 'next/router';
import {logoImg} from '@/config';

export interface Props {
    contactInfo: ContactInfo,
    aboutText: string,
    children: React.ReactNode
};

export default function PageLayout({ contactInfo, aboutText, children}: Props) {

    const router = useRouter();

    const currentPage = router.pathname;

    const onSearchSubmit = (searchTerm: string) => {
        router.push(`/search?term=${searchTerm}`);
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <HeaderSection
                    currentPage={currentPage}
                    onSearchSubmit={onSearchSubmit}
                />
            </div>
            <main className={styles.main}>
                    {children}
            </main>
            <div className={styles.footer}>
                <FooterSection
                    contactInfo = {contactInfo}
                    aboutText = {aboutText}
                    logoImg = {logoImg}
                />
            </div>
        </div>
    );
}