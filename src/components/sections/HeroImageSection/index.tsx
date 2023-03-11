import styles from "@styles/sections/HeroImageSection.module.scss";
import Link from "next/link";
import { LocalImage } from "@/types/image";

import ImageCPN from "@/components/basics/ImageCPN";

export interface Props {
    image: LocalImage;
    text: string;
    linkText: string;
}


export default function HeroImageSection({image, text, linkText }: Props) {


    return (
        <section className={styles.heroImage}>
            <ImageCPN
                image={image}
                sizes="(max-width: 600px) 100vw, 1200px"
                className={styles.image}
            />
            <div className={styles.overlay}>
                <h2 className={styles.text}>
                    {text}
                </h2>
                <Link
                    className={styles.link}
                    href="/shop">
                    {linkText}
                </Link>
            </div>
        </section>
    );
}

HeroImageSection.displayName = "HeroImageSection";