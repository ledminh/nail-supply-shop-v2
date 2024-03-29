import { RemoteImage } from "@/types/image";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: RemoteImage;
  numProducts: number;
  numProductsAndGroups: number;
}
