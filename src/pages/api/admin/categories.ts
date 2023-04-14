import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

import { Category } from "@/types/category";

import { CreateCategoryProps, UpdateCategoryProps } from "@/database/models/category";

import * as DB from "@/database";
import { DBProductGroup, DBProduct } from "@/types/product";
import isProduct from "@/utils/isProduct";

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
  if (req.method === "POST") {
    const {
      query: { type, id: catID },
    } = req;

    switch (type) {
      case "create":
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          }

          const { name, description, imageFileName } = fields;

          if (
            typeof name !== "string" ||
            typeof description !== "string" ||
            typeof imageFileName !== "string"
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid category data" });
          }

          createCategory({ name, description, imageFileName }, res);
        });
        break;

      case "update":
        const form2 = new formidable.IncomingForm();

        form2.parse(req, (err, fields) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          }

          const { id, name, description, imageFileName } = fields;

          if (
            typeof id !== "string" ||
            typeof name !== "string" ||
            typeof description !== "string" 
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid category data" });
          }

          const _imageFileName = imageFileName as string|undefined;

          updateCategory({ id, name, description, imageFileName: _imageFileName }, res);
        });
        break;

      case "delete":
        if (typeof catID !== "string") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid category ID" });
        }

        deleteCategory(catID, res);
        break;
      default:
        res
          .status(400)
          .json({ success: false, message: "Invalid type parameter" });
        break;
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }

}

export const config = {
  api: {
    bodyParser: false,
  },
};


function createCategory(
  { name, description, imageFileName }: CreateCategoryProps,
  res: NextApiCategoryResponse
) {
  DB.createCategory({ name, description, imageFileName })
    .then((dbRes) => {
      if (!dbRes.success) {
        res.status(500).json({ success: false, message: dbRes.message });
        return;
      }

      res.status(200).json({ success: true, category: dbRes.data as Category });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
}

function updateCategory(
  { id, name, description, imageFileName }: UpdateCategoryProps,
  res: NextApiCategoryResponse
) {
  DB.updateCategory({ id, name, description, imageFileName })
    .then((dbRes) => {
      if (!dbRes.success) {
        res.status(500).json({ success: false, message: dbRes.message });
        return;
      }

      const [oldCat, newCat] = dbRes.data as Category[];

      if (oldCat.image.src !== newCat.image.src) {
        deleteImage(oldCat.image.src, 'category');
      }

      res.status(200).json({ success: true, category: newCat });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
}




function deleteCategory(catID: string, res: NextApiCategoryResponse) {
  DB.getProducts({ type: 'all', catID })
    .then((dbRes) => {
      if (!dbRes.success) {
        return Promise.reject({ success: false, message: dbRes.message });
      }

      const products = dbRes.data as (DBProduct|DBProductGroup)[];
      const productImageNames = products.reduce((acc, product) => {
        if (isProduct(product)) {
          acc.push(...(product.images.map((image) => image.src)));
        }
        else {
          const images = product.products.reduce((acc, product) => {
            acc.push(...(product.images.map((image) => image.src)));
            return acc;
          }
          , [] as string[]);

          acc.push(...images);

        }

        return acc;
      }
      , [] as string[]);


      productImageNames.forEach((imageName) => {
        deleteImage(imageName, 'product');
      });


      DB.deleteCategory(catID)
        .then((dbRes) => {
          if (!dbRes.success) {
            res.status(500).json({ success: false, message: dbRes.message });
          }
          else {
            const category = dbRes.data as Category;

            deleteImage(category.image.src, 'category');

            res.status(200).json({ success: true, category });
          }
        }
        )
        .catch((err) => {
          res.status(500).json({ success: false, message: err.message });
        }
        );    
    });
}


const deleteImage = (filename: string, type: 'category'| 'product') => {
  const baseFilename = path.basename(filename);
  const filePath = path.join(
    process.cwd(),
    "public",
    "images",
    type,
    baseFilename
  );

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`);
      }
    });
  });
};


