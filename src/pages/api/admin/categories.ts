import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

import { Category } from "@/types/category";

import {
  CreateCategoryProps,
  UpdateCategoryProps,
} from "@/database/models/category";

import * as DB from "@/database";
import { DBProductGroup, DBProduct } from "@/types/product";
import isProduct from "@/utils/isProduct";
import { getAuth } from "@clerk/nextjs/server";
import removeFile from "@/utils/supaRemove";

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
  const { userId } = getAuth(req);

  if (!userId || userId !== process.env.ADMIN_ID) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

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

          const _imageFileName = imageFileName as string | undefined;

          updateCategory(
            { id, name, description, imageFileName: _imageFileName },
            res
          );
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
  const _exec = async () => {
    const dbRes = await DB.updateCategory({
      id,
      name,
      description,
      imageFileName,
    });

    if (!dbRes.success) {
      return Promise.reject({ success: false, message: dbRes.message });
    }

    const [oldCat, newCat] = dbRes.data as Category[];

    if (oldCat.image.src !== newCat.image.src) {
      const { success: imgSuccess } = await deleteImages(
        [oldCat.image.src],
        "category"
      );

      if (!imgSuccess) {
        return Promise.reject({
          success: false,
          message: "Failed to delete old image",
        });
      }
    }

    return res.status(200).json({ success: true, category: newCat });
  };

  _exec().catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });
}

function deleteCategory(catID: string, res: NextApiCategoryResponse) {
  const _exec = async () => {
    const dbResProducts = await DB.getProducts({ type: "all", catID });

    if (!dbResProducts.success) {
      return Promise.reject({ success: false, message: dbResProducts.message });
    }

    const products = dbResProducts.data as (DBProduct | DBProductGroup)[];
    const productImageNames = products.reduce((acc, product) => {
      if (isProduct(product)) {
        acc.push(...product.images.map((image) => image.src));
      } else {
        const images = product.products.reduce((acc, product) => {
          acc.push(...product.images.map((image) => image.src));
          return acc;
        }, [] as string[]);

        acc.push(...images);
      }

      return acc;
    }, [] as string[]);

    if (productImageNames.length > 0) {
      const { success: productSuccess } = await deleteImages(
        productImageNames,
        "product"
      );

      if (!productSuccess) {
        return Promise.reject({
          success: false,
          message: "Failed to delete product images",
        });
      }
    }

    const dbResCategory = await DB.deleteCategory(catID);

    if (!dbResCategory.success) {
      return Promise.reject({ success: false, message: dbResCategory.message });
    }

    const category = dbResCategory.data as Category;

    const { success: categorySuccess } = await deleteImages(
      [category.image.src],
      "category"
    );

    if (!categorySuccess) {
      return Promise.reject({
        success: false,
        message: "Failed to delete category image",
      });
    }

    return res.status(200).json({ success: true, category });
  };

  _exec().catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });
}

const deleteImages = async (
  filenames: string[],
  type: "category" | "product"
) => {
  const folder = type === "category" ? "category" : "product";

  const _filenames = filenames.map((filename) => {
    const split = filename.split("/");
    return folder + "/" + split[split.length - 1];
  });

  const { error } = await removeFile("nail-supply-store", _filenames);

  if (error) {
    throw new Error(error.message);
  } else {
    return Promise.resolve({
      success: true,
    });
  }
};

// deleteImage locally
// const deleteImage = (filename: string, type: "category" | "product") => {
//   const baseFilename = path.basename(filename);
//   const filePath = path.join(
//     process.cwd(),
//     "public",
//     "images",
//     type,
//     baseFilename
//   );

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error(`File not found: ${filePath}`);
//       return;
//     }

//     fs.unlink(filePath, (err) => {
//       if (err) {
//         console.error(`Error deleting file: ${filePath}`);
//       }
//     });
//   });
// };
