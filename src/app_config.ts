import { nanoid } from 'nanoid';
import { NavigationItem } from '@/types';



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