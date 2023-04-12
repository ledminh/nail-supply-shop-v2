import { StaticImageData } from "next/image";

export type LocalImage = {
  src: StaticImageData;
  alt: string;
};

export type RemoteImage = {
  src: string;
  alt: string;
};
