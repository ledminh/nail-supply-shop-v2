// /api/products.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Order, StatusValue } from '@/types/order';

import { FilterOrder } from '@/types/order';

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
    const {query: {type, id, status}} = req;

    switch (req.method) {
        case 'GET':
            getOrders(res);
            break;
        case 'POST':
            if(type === 'delete') {
              if(typeof id !== 'string'){
                return res.status(400).json({ success: false, message: "Invalid id" });
              }
              return deleteOrder(id, res);       
            
            }
            

            if(type === 'status') {
              if(typeof id !== 'string'){
                return res.status(400).json({ success: false, message: "Invalid id" });
              }
              
              if( typeof status !== 'string'){
                return res.status(400).json({ success: false, message: "Invalid status" });
              }
              
              let _status = status as StatusValue;
              return updateOrderStatus(id, _status, res);
            }

            if(type === 'filter') {
              const {status, month, year, sort, query} = req.body;

              console.log(req.body);

              return filterOrders({status, month, year, sort, query}, res);
            
            }

            res.status(400).json({ success: false, message: "Invalid request" });
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }
}




/***************************
 * Function helpers
 */

const getOrders = async ( res: NextApiCategoryResponse) => {
    const orders = await DB.getOrders() as Order[];

    res.status(200).json({ success: true, orders });
    
    return orders;
}

const deleteOrder = async (id: string, res: NextApiCategoryResponse) => {
    const order = await DB.deleteOrder(id);

    if(!order) {
        return res.status(400).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, orders: [order] });

}

const updateOrderStatus = async (id: string, status: StatusValue, res: NextApiCategoryResponse) => {
    const order = await DB.updateOrderStatus(id, status);

    if(!order) {
        return res.status(400).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, orders: [order] });
}

const filterOrders = async (filter:FilterOrder, res: NextApiCategoryResponse) => {

    const orders = await DB.filterOrders(filter);

    res.status(200).json({ success: true, orders });
}



const generateID = () => {
  return Math.random().toString(36).substring(2, 13);
}
