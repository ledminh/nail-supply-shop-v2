import { StaticImageData } from "next/image";

export type LocalImage = StaticImageData;
export type RemoteImage = {
    url: string;
    alt: string;
}