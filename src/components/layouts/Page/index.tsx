import FooterSection from '@/components/sections/Footer';
import HeaderSection from '@/components/sections/HeaderSection';
import styles from '@styles/layouts/PageLayout.module.scss';

import type { ContactInfo } from '@/types/others';
import type { LocalImage } from '@/types/image';

export interface Props {
    currentPage: string,
    onSearchSubmit: (searchTerm: string) => void,
    contactInfo: ContactInfo,
    aboutText: string,
    logoImg: LocalImage,
    children: React.ReactNode
};

export default function PageLayout({currentPage, onSearchSubmit, contactInfo, aboutText, logoImg, children}: Props) {

    

    return (
        <>
            <HeaderSection
                currentPage={currentPage}
                onSearchSubmit={onSearchSubmit}
            />
                <main className={styles.main}>
                    {children}
                </main>
            <FooterSection
                contactInfo = {contactInfo}
                aboutText = {aboutText}
                logoImg = {logoImg}
            />
        </>
    );
}