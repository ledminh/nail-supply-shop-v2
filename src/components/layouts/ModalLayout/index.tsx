import styles from '@styles/layouts/ModalLayout.module.scss';
import { useEffect } from 'react';

export interface Props {
    title: string;
    children: React.ReactNode;
    FooterComponent: React.FC;
};

export default function ModalLayout({title, children, FooterComponent}: Props) {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        }
    }, []);


    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h2>{title}</h2>
                    </div>

                </div>
                <div className={styles.body}>
                    {children}
                </div>
                <div className={styles.footer}>
                    <FooterComponent />
                </div>
            </div>
        </div>
    );
}