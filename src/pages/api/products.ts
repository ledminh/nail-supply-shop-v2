// /api/products.ts

import { Product, ProductGroup } from "@/types/product";
import type { NextApiRequest, NextApiResponse } from "next";

import * as DB from "@/database";
import { FindProductOptions } from "@/database/models/product";

export type ProductApiResponse =
  | {
      success: true;
      products?: undefined;
      product?: undefined;
      message: string;
    }
  | {
      success: true;
      products: (Product | ProductGroup)[];
      product?: undefined;
      message?: undefined;
    }
  | {
      success: true;
      products?: undefined;
      product: Product | ProductGroup;
      message?: undefined;
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
    query: { type, catID },
  } = req;

  switch (req.method) {
    case "GET":
      if (typeof catID === "string") {
        getProducts({ catID }, res);
      }

      break;
    case "POST":
      return getProducts(req.body, res);

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

const getProducts = (
  options: FindProductOptions,
  res: NextApiCategoryResponse
) => {
  DB.getProducts(options)
    .then((dBRes) => {
      if (!dBRes.success) {
        return res.status(500).json({ success: false, message: dBRes.message });
      }

      const products = dBRes.data;

      if (!Array.isArray(products)) {
        return res.status(500).json({
          success: false,
          message: "Products is not an array",
        });
      }

      return res.status(200).json({ success: true, products });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });
};
