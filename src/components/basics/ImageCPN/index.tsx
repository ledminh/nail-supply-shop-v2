import { FC } from "react";

import Image from "next/image";

import styles from "@styles/basics/ImageCPN.module.scss";
import { LocalImage, RemoteImage } from "@/types/image";



export interface Props  {
    image: LocalImage | RemoteImage;
    size: 'small' | 'medium' | 'large';
    className?: string;
};

type Image = FC<Props>;


const ImageCPN:Image = ({image, size, className}) => {

    const classNames = [styles.image, className].join(" ");

    const sizes = {
        small: "(max-width: 600px) 50vw, 600px",
        medium: "(max-width: 600px) 100vw, 900px",
        large: "(max-width: 600px) 100vw, 1400px",
    }[size];

    return (
        <div className={classNames}>
            <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{
                    objectFit: "cover",
                }}
                sizes={sizes}
            />
        </div>
    );
}

export default ImageCPN;

ImageCPN.displayName = "ImageCPN";