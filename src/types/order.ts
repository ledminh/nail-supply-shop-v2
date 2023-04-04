import { OrderedProduct } from "./product";


export type ShippingAddress = {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    email: string;
}

export type Order = {
    id: string;
    shippingAddress: ShippingAddress;
    orderedProducts: OrderedProduct[];
    status: {
        value: StatusValue;
        lastUpdated: string;
        description: string;
    },
}


export type StatusValue =  "processing" | "shipped" | "delivered" ;

export type FilterOrder = {
    status: StatusValue | 'all';
    month: string;
    year: null;
    sort: string;
    query: string;
} | {
    status: StatusValue | 'all';
    month: null;
    year: string;
    sort: string;
    query: string;
};