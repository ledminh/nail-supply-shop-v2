import { WebsiteTitle } from '@/types/others';
import styles from '@styles/WebsiteTitleCPN.module.scss';
import Image from 'next/image';

export type Props = WebsiteTitle;
    


export default function WebsiteTitleCPN(
    props: Props
) {


    return (
        <div className={styles.wrapper}>
            {
                props.image? (
                    <Image
                        src={props.image}
                        alt={props.alt}
                    />
                ) : (
                    <>
                        <h1 className={styles.title}>{props.title}</h1>
                        <h4 className={styles.subtitle}>{props.subtitle}</h4>
                    </>
                )
            }
            
        </div>
    );
}