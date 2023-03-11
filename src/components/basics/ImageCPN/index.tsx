import { FC } from "react";

import Image from "next/image";

import styles from "@styles/basics/ImageCPN.module.scss";
import { LocalImage, RemoteImage } from "@/types/image";



export interface Props  {
    image: LocalImage | RemoteImage;
    sizes: string;
    className?: string;
};

type Image = FC<Props>;


const ImageCPN:Image = ({image, sizes, className}) => {

    const classNames = [styles.image, className].join(" ");

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