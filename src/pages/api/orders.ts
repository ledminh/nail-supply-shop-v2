// /api/products.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Order, StatusValue } from "@/types/order";

import { FilterOrder } from "@/types/order";

import * as DB from "@/database";
import { getAuth } from "@clerk/nextjs/server";

export type ProductApiResponse =
  | {
      success: true;
      orders: Order[];
    }
  | {
      success: false;
      message: string;
    };

type NextApiCategoryResponse = NextApiResponse<ProductApiResponse>;

export default function handler(
  req: NextApiRequest,
  res: NextApiCategoryResponse
) {
  const {
    query: { type, id, status },
  } = req;

  const { userId } = getAuth(req);

  switch (req.method) {
    case "GET":
      getOrders(res);
      break;
    case "POST":
      if (type === "delete") {
        if (!userId || userId !== process.env.ADMIN_ID) {
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
        }

        if (typeof id !== "string") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid id" });
        }
        return deleteOrder(id, res);
      }

      if (type === "status") {
        if (!userId || userId !== process.env.ADMIN_ID) {
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
        }

        if (typeof id !== "string") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid id" });
        }

        if (typeof status !== "string") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid status" });
        }

        let _status = status as StatusValue;
        return updateOrderStatus(id, _status, res);
      }

      if (type === "filter") {
        const { status, month, year, sort, query } = req.body;

        return filterOrders({ status, month, year, sort, query }, res);
      }

      res.status(400).json({ success: false, message: "Invalid request" });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

/***************************
 * Function helpers
 */

const getOrders = async (res: NextApiCategoryResponse) => {
  const resDB = await DB.getOrders();

  if (!resDB.success) {
    return res.status(400).json({ success: false, message: "No orders found" });
  }

  const { data } = resDB as { data: Order[] };

  return res.status(200).json({ success: true, orders: data });
};

const deleteOrder = async (id: string, res: NextApiCategoryResponse) => {
  const dbRes = await DB.deleteOrder(id);

  if (!dbRes.success) {
    return res.status(400).json({ success: false, message: "Order not found" });
  }

  res.status(200).json({ success: true, orders: dbRes.data as Order[] });
};

const updateOrderStatus = async (
  id: string,
  status: StatusValue,
  res: NextApiCategoryResponse
) => {
  const dbRes = await DB.updateOrderStatus(id, status);

  if (!dbRes.success) {
    return res.status(400).json({ success: false, message: "Order not found" });
  }

  res.status(200).json({ success: true, orders: [dbRes.data as Order] });
};

const filterOrders = async (
  filter: FilterOrder,
  res: NextApiCategoryResponse
) => {
  const dbRes = await DB.filterOrders(filter);

  if (!dbRes.success) {
    return res.status(400).json({ success: false, message: "No orders found" });
  }

  const { data } = dbRes as { data: Order[] };

  return res.status(200).json({ success: true, orders: data });
};

const generateID = () => {
  return Math.random().toString(36).substring(2, 13);
};
