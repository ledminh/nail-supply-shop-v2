import { LocalImage } from "./image";


export type WebsiteTitle = {
    title: string;
    subtitle: string;
    image?: undefined;
    alt?: undefined;
} | {
    title?: undefined;
    subtitle?: undefined;
    image: LocalImage;
    alt: string;
}