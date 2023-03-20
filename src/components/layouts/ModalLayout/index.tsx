import styles from '@styles/layouts/ModalLayout.module.scss';


export interface Props {
    title: string;
    children: React.ReactNode;
    FooterComponent: React.FC;
};

export default function ModalLayout({title, children, FooterComponent}: Props) {

    

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h2>{title}</h2>
                    </div>
                    <div className={styles.close}>
                        <button className={styles.closeButton}>X</button>
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