import Image from "next/image";

import styles from "@styles/sections/HeroImageSection.module.scss";
import ButtonCPN from "@/components/basics/ButtonCPN";
import { LocalImage } from "@/types/image";


export interface Props {
    heroImage: LocalImage;
    alt: string;
    text: string;
}


export default function HeroImageSection({heroImage, alt, text }: Props) {


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
                <p className={styles.text}>
                    {text}
                </p>
                <ButtonCPN/>
            </div>
        </section>
    );
}

HeroImageSection.displayName = "HeroImageSection";