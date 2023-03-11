import { WebsiteTitle } from '@/types/others';
import styles from '@styles/basics/WebsiteTitleCPN.module.scss';
import ImageCPN from '@components/basics/ImageCPN';

export type Props = WebsiteTitle;
    


export default function WebsiteTitleCPN(
    props: Props
) {


    return (
        <div className={styles.wrapper}>
            {
                props.image? (
                    <ImageCPN
                        image={props.image}
                        sizes="(max-width: 600px) 100vw, 900px"
                        className={styles.image}
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