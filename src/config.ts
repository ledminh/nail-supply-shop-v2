import { nanoid } from 'nanoid';
import { NavigationItem } from '@/types/item';
import { WebsiteTitle } from '@/types/others';
import { LocalImage } from '@/types/image';
import logoJPG from '@images/logo.jpg';
import type {Props as HeroImageSectionProps} from '@/components/sections/HeroImageSection';
import heroImagePNG from '@images/hero_image.png';
import searchIconPNG from '@images/search_icon.png';
import shopImagePNG from '@images/shop_image.png';
import { SortedOrderItem, SortItem } from './types/list-conditions';

import type { AdminSection } from './types/others';
import CategoryManagementSection from '@components/sections/CategoryManagementSection';
import ProductManagementSection from '@components/sections/ProductManagementSection';
import AboutUsManagementSection from '@components/sections/AboutUsManagementSection';
import OrderManagementSection from '@components/sections/OrderManagementSection';
import { StatusValue } from './types/order';


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
 *  Order
 */


export const orderStatus: Record<StatusValue, string> = {
    processing: "Your order is being prepared for shipment",
    shipped: "Order Shipped - In Transit: Your order is on its way to you",
    delivered: "Order Delivered - Received by Customer: Your order has been successfully delivered",
};

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

    
    productsPerPage: 4,
}


/*****************************
 *  Admin pages
 */

const adminSections: AdminSection[] = [
    {
        id: "admin/category",
        name: "Category",
        slug: "category",
        component: CategoryManagementSection
    },
    {
        id: "admin/product",
        name: "Product",
        slug: "product",
        component: ProductManagementSection
    },
    {
        id: "admin/aboutus",
        name: "About Us",
        slug: "about-us",
        component: AboutUsManagementSection
    },
    {
        id: "admin/orders",
        name: "Orders",
        slug: "orders",
        component: OrderManagementSection
    }
]
    

export const adminConfig = {
    sections: adminSections  
}

/*****************************
 * /admin/category
 */

export const categoryManagementConfig = {
    warningMessage: (categoryName: string): string =>
        `Delete ${categoryName} category? This will also delete all of its associated products.`
};

/*****************************
 * /admin/product
 */
export const productManagementConfig = {
    warningMessages: {
        deleteProduct: (productName: string): string => `Are you sure you want to delete ${productName} product?`,
        deleteGroup: (groupName: string): string => `Are you sure you want to delete ${groupName} product group? All of its associated products will also be deleted.`,
    }
};