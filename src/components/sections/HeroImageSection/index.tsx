import Image from "next/image";

import styles from "@styles/sections/HeroImageSection.module.scss";
import Link from "next/link";
import { LocalImage } from "@/types/image";


export interface Props {
    heroImage: LocalImage;
    alt: string;
    text: string;
    linkText: string;
}


export default function HeroImageSection({heroImage, alt, text, linkText }: Props) {


    return (
        <section className={styles.heroImage}>
            <div className={styles.image}>
                <Image
                    src={heroImage}
                    alt={alt}
                    fill
                    style={{
                        objectFit: "cover",
                    }}
                    sizes="(max-width: 600px) 100vw, 1200px"
                />
            </div>
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