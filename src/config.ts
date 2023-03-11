import { nanoid } from 'nanoid';
import { NavigationItem } from '@/types/item';
import { WebsiteTitle } from '@/types/others';



export const navigationItems:NavigationItem[] = [
    {
        id: nanoid(),
        label: 'Home',
        path: '/'
    },
    {
        id: nanoid(),
        label: 'Shop',
        path: '/shop'
    },
    {
        id: nanoid(),
        label: 'Cart',
        path: '/cart'
    },
    {
        id: nanoid(),
        label: 'About',
        path: '/about'
    },
];

export const websiteTitle:WebsiteTitle = {
    title: 'NAIL ESSENTIAL',
    subtitle: 'Elevate your nail game with our products',
};