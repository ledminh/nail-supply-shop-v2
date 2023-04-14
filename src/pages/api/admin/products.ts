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

import fs from "fs";
import randomId from "@/utils/randomId";

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

function deleteImages(imagePaths: string[]) {
  for (const imagePath of imagePaths) {
    try {
      if (imagePath.startsWith("/images/product/")) {
        const imgName = imagePath.replace("/images/product/", "");

        if (fs.existsSync(`public/images/product/${imgName}`)) {
          fs.unlink(`public/images/product/${imgName}`, (err) => {
            if (err) {
              console.error(`Failed to delete image: ${imagePath}`, err);
            }
          });
        }
      }
    } catch (err) {
      console.error(`Failed to delete image: ${imagePath}`, err);
    }
  }
}




const deleteSingleProduct = (id: string, res: NextApiProductResponse) => {
  DB.getProduct({ id })
    .then((dBRes) => {
      if (!dBRes.success) {
        return res.status(500).json({ success: false, message: dBRes.message });
      }

      const product = dBRes.data;

      if (Array.isArray(product) || !isProduct(product)) {
        return res
          .status(404)
          .json({ success: false, message: "Incorrect type" });
      }

      deleteImages(product.images.map((image) => image.src));

      DB.deleteProduct({ id })
        .then((dbRes) => {
          if (!dbRes.success) {
            return res
              .status(500)
              .json({ success: false, message: dbRes.message });
          }

          res.status(200).json({ success: true, message: "Product deleted" });
        })
        .catch((err) => {
          res.status(500).json({ success: false, message: err.message });
        });

    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
};

const deleteGroup = (id: string, res: NextApiProductResponse) => {
  DB.getGroup({ id })
    .then((dBRes) => {
      if (!dBRes.success) {
        return res.status(500).json({ success: false, message: dBRes.message });
      }

      const group = dBRes.data;

      const images = group.products.reduce((acc: ProductImage[], product) => {
        acc.push(...product.images);

        return acc;
      }, []);

      deleteImages(images.map((image) => image.src));

      DB.deleteGroup({ id })
        .then((dbRes) => {
          if (!dbRes.success) {
            return res
              .status(500)
              .json({ success: false, message: dbRes.message });
          }

          res.status(200).json({ success: true, message: "Product deleted" });
        })
        .catch((err) => {
          res.status(500).json({ success: false, message: err.message });
        });

    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
};

const addProduct = (req: NextApiRequest, res: NextApiProductResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const { serialNumber, categoryID, name, intro, details, price, images } =
      fields;

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
          return res.status(500).json({ success: false, message: dbRes.message });
        }

        console.log('after', dbRes.data);

        return res.status(200).json({ success: true, product: dbRes.data });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });
  });
};

const updateProduct = (req: NextApiRequest, res: NextApiProductResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
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
      DB.getGroup({ id: groupID })
        .then((dBRes) => {
          if (!dBRes.success) {
            return res
              .status(500)
              .json({ success: false, message: dBRes.message });
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

          deleteImages(imagesToDelete.map((image) => image.src));

          const newProduct: DBProduct = {
            id: serialNumber,
            categoryID,
            name,
            intro,
            details,
            price: Number(price),
            images: newImages,
            dateCreated: oldProduct.dateCreated,
            lastUpdated: new Date().toISOString(),
            sellCount: oldProduct.sellCount,
          };

          DB.updateGroupProduct({ groupID, product: newProduct })
            .then((dbRes) => {
              if (!dbRes.success) {
                return res
                  .status(500)
                  .json({ success: false, message: dbRes.message });
              }


              return res
                .status(200)
                .json({ success: true, product: dbRes.data });
            })
            .catch((err) => {
              return res
                .status(500)
                .json({ success: false, message: err.message });
            });
        })
        .catch((err) => {
          return res.status(500).json({ success: false, message: err.message });
        });
    }
    else {
      
          // Product is not in a group
          
          DB.getProduct({ id: serialNumber }).then((dBRes) => {
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
      
            deleteImages(imagesToDelete.map((image) => image.src));
      
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
      
            DB.updateProduct({ product: newProduct })
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
      
    }

  });
};

const updateGroup = (req: NextApiRequest, res: NextApiProductResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields) => {
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

    DB.getGroup({ id })
      .then((dBRes) => {
        if (!dBRes.success) {
          return res
            .status(500)
            .json({ success: false, message: dBRes.message });
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

        deleteImages(imagesToDelete.map((image) => image.src));

        const newGroup: DBProductGroup = {
          id,
          name,
          categoryID,
          products: newProducts,
          lastUpdated: new Date().toISOString(),
          dateCreated: group.dateCreated,
        };

        DB.updateGroup({ group: newGroup })
          .then((dbRes) => {
            if (!dbRes.success) {
              return res
                .status(500)
                .json({ success: false, message: dbRes.message });
            }

            return res.status(200).json({ success: true, product: dbRes.data });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });
  });
};

