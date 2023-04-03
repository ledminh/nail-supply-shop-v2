// /api/products.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Order } from '@/types/order';

import * as DB from '@/database';

export type ProductApiResponse = {
  success: true,
  orders: Order[],
} | {
  success: false,
  message: string
};

type NextApiCategoryResponse = NextApiResponse<ProductApiResponse>;



export default function handler(req: NextApiRequest, res: NextApiCategoryResponse) {

    switch (req.method) {
        case 'GET':
            getOrders(req, res);

            break;
        case 'POST':
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }
}




/***************************
 * Function helpers
 */

const getOrders = async (req: NextApiRequest, res: NextApiCategoryResponse) => {
    const orders = await DB.getOrders();

    res.status(200).json({ success: true, orders });
    
    return orders;
}

const generateID = () => {
  return Math.random().toString(36).substring(2, 13);
}
