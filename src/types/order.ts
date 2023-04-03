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