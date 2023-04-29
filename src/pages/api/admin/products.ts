import { NextApiRequest, NextApiResponse } from "next";
import * as DB from "@/database";
import isProduct from "@/utils/isProduct";

import {
  ProductImage,
  Product,
  ProductGroup,
  DBProduct,
  DBProductGroup,
} from "@/types/product";
import formidable from "formidable";

import randomId from "@/utils/randomId";
import { getAuth } from "@clerk/nextjs/server";

import deleteImages from "@/utils/deleteImages";

export type ProductApiResponse =
  | {
      success: true;
      message?: string;
      product?: Product | ProductGroup;
    }
  | {
      success: false;
      message: string;
    };

type NextApiProductResponse = NextApiResponse<ProductApiResponse>;

export default function handler(
  req: NextApiRequest,
  res: NextApiProductResponse
) {
  const { userId } = getAuth(req);

  if (!userId || userId !== process.env.ADMIN_ID) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const {
    query: { type, id },
  } = req;

  switch (req.method) {
    case "POST":
      if (type === "delete-single-product") {
        if (typeof id !== "string")
          return res
            .status(400)
            .json({ success: false, message: "Invalid product ID" });

        return deleteSingleProduct(id, res);
      }

      if (type === "delete-group") {
        if (typeof id !== "string")
          return res
            .status(400)
            .json({ success: false, message: "Invalid group ID" });

        return deleteGroup(id, res);
      }

      if (type === "add-product") {
        addProduct(req, res);
      }

      if (type === "add-group") {
        addGroup(req, res);
      }

      if (type === "update-product") {
        updateProduct(req, res);
      }

      if (type === "update-group") {
        updateGroup(req, res);
      }

      break;

    default:
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

/*********************************
 * Helper functions
 *********************************/

const deleteSingleProduct = (id: string, res: NextApiProductResponse) => {
  const _exec = async () => {
    const dBRes = await DB.getProduct({ id });

    if (!dBRes.success) {
      return res.status(500).json({ success: false, message: dBRes.message });
    }

    const product = dBRes.data;

    if (Array.isArray(product) || !isProduct(product)) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect type" });
    }

    const { success } = await deleteImages(
      product.images.map((image) => image.src),
      "product"
    );

    if (!success) {
      return res
        .status(500)
        .json({ success: false, message: "Error deleting images" });
    }

    const dbResDelete = await DB.deleteProduct({ id });

    if (!dbResDelete.success) {
      return res
        .status(500)
        .json({ success: false, message: dbResDelete.message });
    }

    return res.status(200).json({ success: true, message: "Product deleted" });
  };

  _exec().catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });
};

const deleteGroup = (id: string, res: NextApiProductResponse) => {
  const _exec = async () => {
    const dBRes = await DB.getGroup({ id });

    if (!dBRes.success) {
      return res.status(500).json({ success: false, message: dBRes.message });
    }

    const group = dBRes.data;

    const images = group.products.reduce((acc: ProductImage[], product) => {
      acc.push(...product.images);

      return acc;
    }, []);

    const { success } = await deleteImages(
      images.map((image) => image.src),
      "product"
    );

    if (!success) {
      return res
        .status(500)
        .json({ success: false, message: "Error deleting images" });
    }

    const dbResDelete = await DB.deleteGroup({ id });

    if (!dbResDelete.success) {
      return res
        .status(500)
        .json({ success: false, message: dbResDelete.message });
    }

    return res.status(200).json({ success: true, message: "Group deleted" });
  };

  _exec().catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });
};

const addProduct = (req: NextApiRequest, res: NextApiProductResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const {
      serialNumber,
      categoryID,
      name,
      intro,
      details,
      price,
      images,
    } = fields;

    if (
      typeof serialNumber !== "string" ||
      typeof categoryID !== "string" ||
      typeof name !== "string" ||
      typeof intro !== "string" ||
      typeof details !== "string" ||
      typeof price !== "string" ||
      typeof images !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const product: DBProduct = {
      id: serialNumber,
      categoryID,
      name,
      intro,
      details,
      price: Number(price),
      images: JSON.parse(images),
      dateCreated: new Date().toISOString(),
      sellCount: 0,
    };

    DB.addProduct({ product })
      .then((dbRes) => {
        if (!dbRes.success) {
          return res
            .status(500)
            .json({ success: false, message: dbRes.message });
        }

        return res.status(200).json({ success: true, product: dbRes.data });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });
  });
};

const addGroup = (req: NextApiRequest, res: NextApiProductResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const { name, categoryID, products } = fields;

    if (
      typeof name !== "string" ||
      typeof products !== "string" ||
      typeof categoryID !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const groupID = randomId(10, "prdt-grp-");

    const _products = JSON.parse(products).map((product: DBProduct) => {
      return {
        ...product,
        groupID,
        categoryID: product.categoryID || group.categoryID,
      };
    });

    const group: DBProductGroup = {
      id: groupID,
      name,
      categoryID,
      products: _products,
      dateCreated: new Date().toISOString(),
    };

    DB.addGroup({ group })
      .then((dbRes) => {
        if (!dbRes.success) {
          return res
            .status(500)
            .json({ success: false, message: dbRes.message });
        }

        return res.status(200).json({ success: true, product: dbRes.data });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });
  });
};

const updateProduct = (req: NextApiRequest, res: NextApiProductResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const {
      serialNumber,
      categoryID,
      groupID,
      name,
      intro,
      details,
      price,
      images,
    } = fields;

    if (
      typeof serialNumber !== "string" ||
      typeof categoryID !== "string" ||
      typeof name !== "string" ||
      typeof intro !== "string" ||
      typeof details !== "string" ||
      typeof price !== "string" ||
      typeof images !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const newImages: ProductImage[] = JSON.parse(images);

    // Product is in a group
    if (typeof groupID === "string") {
      const dBRes = await DB.getGroup({ id: groupID });

      if (!dBRes.success) {
        return res.status(500).json({ success: false, message: dBRes.message });
      }

      const group = dBRes.data;

      const oldProduct = group.products.find(
        (product) => product.id === serialNumber
      );

      if (!oldProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const oldImages = oldProduct.images;

      const imagesToDelete = oldImages.filter((oldImage) => {
        return !newImages.find((newImage) => newImage.src === oldImage.src);
      });

      const resImage = await deleteImages(
        imagesToDelete.map((image) => image.src),
        "product"
      );

      if (!resImage.success) {
        return res
          .status(500)
          .json({ success: false, message: "Error delete product's images" });
      }

      const newProduct: DBProduct = {
        id: serialNumber,
        categoryID,
        groupID,
        name,
        intro,
        details,
        price: Number(price),
        images: newImages,
        dateCreated: oldProduct.dateCreated,
        lastUpdated: new Date().toISOString(),
        sellCount: oldProduct.sellCount,
      };

      const updateGroupRes = await DB.updateGroupProduct({
        groupID,
        product: newProduct,
      });

      if (!updateGroupRes.success) {
        return res
          .status(500)
          .json({ success: false, message: updateGroupRes.message });
      } else {
        return res
          .status(200)
          .json({ success: true, product: updateGroupRes.data });
      }
    } else {
      // Product is not in a group
      const dBRes = await DB.getProduct({ id: serialNumber });

      if (!dBRes.success) {
        return res.status(500).json({ success: false, message: dBRes.message });
      }

      const product = dBRes.data;

      if (Array.isArray(product) || !isProduct(product)) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const oldImages = product.images;

      const imagesToDelete = oldImages.filter((oldImage) => {
        return !newImages.find((newImage) => newImage.src === oldImage.src);
      });

      const imageRes = await deleteImages(
        imagesToDelete.map((image) => image.src),
        "product"
      );

      if (!imageRes.success) {
        return res
          .status(500)
          .json({ success: false, message: "Error delete product's images" });
      }

      const newProduct: DBProduct = {
        id: serialNumber,
        categoryID,
        name,
        intro,
        details,
        price: Number(price),
        images: newImages,
        lastUpdated: new Date().toISOString(),
        dateCreated: product.dateCreated,
        sellCount: product.sellCount,
      };

      const updateProductRes = await DB.updateProduct({ product: newProduct });

      if (!updateProductRes.success) {
        return res
          .status(500)
          .json({ success: false, message: updateProductRes.message });
      } else {
        return res
          .status(200)
          .json({ success: true, product: updateProductRes.data });
      }
    }
  });
};

const updateGroup = (req: NextApiRequest, res: NextApiProductResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const { id, name, categoryID, products } = fields;

    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      typeof categoryID !== "string" ||
      typeof products !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const newProducts: DBProduct[] = JSON.parse(products);

    const dBRes = await DB.getGroup({ id });

    if (!dBRes.success) {
      return res.status(500).json({ success: false, message: dBRes.message });
    }

    const group = dBRes.data;

    const oldProducts = group.products;

    const imagesToDelete = oldProducts.reduce((acc, product) => {
      const newProduct = newProducts.find(
        (newProduct) => newProduct.id === product.id
      );

      if (!newProduct) {
        return [...acc, ...product.images];
      }

      const oldImages = product.images;

      const imagesToDelete = oldImages.filter((oldImage) => {
        return !newProduct.images.find(
          (newImage) => newImage.src === oldImage.src
        );
      });

      return [...acc, ...imagesToDelete];
    }, [] as ProductImage[]);

    const imageRes = await deleteImages(
      imagesToDelete.map((image) => image.src),
      "product"
    );

    if (!imageRes.success) {
      return res
        .status(500)
        .json({ success: false, message: "Error delete product's images" });
    }

    const newGroup: DBProductGroup = {
      id,
      name,
      categoryID,
      products: newProducts,
      lastUpdated: new Date().toISOString(),
      dateCreated: group.dateCreated,
    };

    const updateRes = await DB.updateGroup({ group: newGroup });

    if (!updateRes.success) {
      return res
        .status(500)
        .json({ success: false, message: updateRes.message });
    } else {
      return res.status(200).json({ success: true, product: updateRes.data });
    }
  });
};
