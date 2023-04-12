import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

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

  // else if (type === 'create') {

  // }
  // else if (type === 'update') {
  //   const form = new formidable.IncomingForm();

  //   form.parse(req, (err, fields) => {
  //     if (err) {
  //       res.status(500).json({ message: err.message });
  //       return;
  //     }

  //     const { id, name, description, imageFileName } = fields;

  //     const categoryIndex = categories.findIndex((category) => category.id === id);

  //     if (categoryIndex === -1) {
  //       res.status(404).json({ message: 'Category not found' });
  //       return;
  //     }

  //     // user did not change the image
  //     if(!imageFileName) {
  //       categories[categoryIndex] = {
  //         ...categories[categoryIndex],
  //         name: name as string,
  //         description: description as string,
  //       };
  //       res.status(200).json(categories[categoryIndex]);
  //       return;
  //     }

  //     deleteImage(categories[categoryIndex].image.src);

  //     categories[categoryIndex] = {
  //       ...categories[categoryIndex],
  //       name: name as string,
  //       description: description as string,
  //       image: imageFileName === 'undefined' ? categories[categoryIndex].image :{
  //         src: `/images/category/${imageFileName}`,
  //         alt: name as string,
  //       },
  //     };

  //     res.status(200).json(categories);
  //   });
  // }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

function deleteCategory(catID: string, res: NextApiCategoryResponse) {
  DB.deleteCategory(catID)
    .then((dbRes) => {
      if (!dbRes.success) {
        res.status(500).json({ success: false, message: dbRes.message });
        return;
      }

      deleteImage((dbRes.data as Category).image.src);

      res.status(200).json({ success: true, category: dbRes.data as Category });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
}

type CreateCategoryProps = {
  name: string;
  description: string;
  imageFileName: string;
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

const deleteImage = (filename: string) => {
  const baseFilename = path.basename(filename);
  const filePath = path.join(
    process.cwd(),
    "public",
    "images",
    "category",
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
