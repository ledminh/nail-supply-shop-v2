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

export type ContactInfo = {
    email: string;
    phone: string;
    additionalInfos?: string[];
}



type SortType = 'name' | 'price';
type SortLabel = 'Name' | 'Price';

type SortedOrderType = 'asc' | 'desc'; 
type SortedOrderLabel = 'Ascending' | 'Descending';

export type SortItem = {
    label: SortLabel;
    value: SortType;
}

export type SortedOrderItem = {
    label: SortedOrderLabel;
    value: SortedOrderType;
}

export type OptionItem = {
    label: string;
    value: string;
}

export type ListCondition = {
    sort?: SortItem;
    sortedOrder?: SortedOrderItem
}