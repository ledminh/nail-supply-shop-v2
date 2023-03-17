import { nanoid } from 'nanoid';
import { NavigationItem } from '@/types/item';
import { WebsiteTitle } from '@/types/others';
import { LocalImage } from '@/types/image';
import logoJPG from '@images/logo.jpg';
import type {Props as HeroImageSectionProps} from '@/components/sections/HeroImageSection';
import heroImagePNG from '@images/hero_image.png';
import searchIconPNG from '@images/search_icon.png';
import shopImagePNG from '@images/shop_image.png';
import { ListCondition, SortedOrderItem, SortItem } from './types/list-conditions';

/***************************
 *  Header
 */

export const websiteTitle:WebsiteTitle = {
    title: 'NAIL ESSENTIAL',
    subtitle: 'Elevate your nail game with our products',
};


export const searchIcon:LocalImage = {
    src: searchIconPNG,
    alt: 'Search Icon',
}

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


/***************************
 *  Footer
 */

export const logoImg:LocalImage = {
    src: logoJPG,
    alt: 'Nail Essential Logo',
}


/*****************************
 *  Home Page
 */

const heroImageSectionProps:HeroImageSectionProps = {
    image: {
        src: heroImagePNG,
        alt: 'Nail Essential Hero Image', 
    },
    text: "Transform your look with our nail supplies",
    linkText: "Shop Now",
}




export const homeConfig = {
    heroImageSectionProps: heroImageSectionProps,
    categoryIntro: "Find your signature style with our diverse selection of categories."
} 


/*****************************
 *  /shop
 */
const shopImageSectionProps:HeroImageSectionProps = {
    image: {
        src: shopImagePNG,
        alt: 'Nail Essential Shop', 
    },
    text: "Explore our wide range of nail care categories."
}

export const shopConfig = {
    heroImageSectionProps: shopImageSectionProps,
}

/*****************************
 * /category/[slug].tsx
 */

type CategoryConfig = {
    sortItems: SortItem[],
    sortedOrderItems: SortedOrderItem[],
    initCondition: ListCondition,
    productsPerPage: number,
}

export const categoryConfig:CategoryConfig = {
    sortItems: [
        {
            label: 'Name',
            value: 'name'
        },
        {
            label: 'Price',
            value: 'price'
        }
    ],

    sortedOrderItems: [
        {
            label: 'Ascending',
            value: 'asc'
        },
        {
            label: 'Descending',
            value: 'desc'
        }
    ],

    initCondition: {
        sort: {
            label: 'Name',
            value: 'name'
        },
        sortedOrder: {
            label: 'Ascending',
            value: 'asc'
        }
    },

    productsPerPage: 20,
}


