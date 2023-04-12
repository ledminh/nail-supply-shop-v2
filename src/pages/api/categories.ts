// /api/categories.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Category } from "@/types/category";

import * as DB from "@/database";

export type CategoryApiResponse =
  | {
      success: true;
      categories?: Category[];
      category?: Category;
    }
  | {
      success: false;
      message: string;
    };

type NextApiCategoryResponse = NextApiResponse<CategoryApiResponse>;

export default function handler(
  req: NextApiRequest,
  res: NextApiCategoryResponse
) {
  if (req.method === "GET") {
    getCategories(res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

/**********************
 * Helper Functions
 */

function getCategories(res: NextApiCategoryResponse) {
  DB.getCategories()
    .then((dbRes) => {
      if (!dbRes.success) {
        res.status(500).json({ success: false, message: dbRes.message });
        return;
      }
      const categories = dbRes.data;

      res.status(200).json({
        success: true,
        categories: categories as Category[],
      });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
}
