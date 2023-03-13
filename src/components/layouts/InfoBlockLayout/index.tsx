import SeparatorCPN from '@/components/basics/SeparatorCPN';
import styles from '@styles/layouts/InfoBlockCPN.module.scss';
import { ReactNode } from 'react';


export interface Props {
    title: string;
    children: ReactNode
};

export default function InfoBlockLayout({
    title,
    children    
}: Props) {

    

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>{title}</h3>
            <SeparatorCPN/>
            <div className={styles.body}>
                {children}
            </div>
        </div>

    );
}