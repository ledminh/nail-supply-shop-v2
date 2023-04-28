import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer, { FileFilterCallback } from "multer";

interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
  files: Express.Multer.File[];
}

const imageFilter = (
  req: any,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const catImageUpload = multer({
  storage: multer.diskStorage({
    destination: "./public/images/category",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `cat-image-${uniqueSuffix}.${
        file.mimetype.split("/")[1]
      }`;
      cb(null, fileName);
    },
  }),
  fileFilter: imageFilter,
});

const productImagesUpload = multer({
  storage: multer.diskStorage({
    destination: "./public/images/product",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `product-image-${uniqueSuffix}.${
        file.mimetype.split("/")[1]
      }`;

      cb(null, fileName);
    },
  }),
  fileFilter: imageFilter,
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.statusCode = 501;
    res.end(
      JSON.stringify({ error: `Sorry something Happened! ${error.message}` })
    );
  },
  onNoMatch(req, res) {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method '${req.method}' Not Allowed` }));
  },
});

apiRoute.post((req: MulterRequest, res: NextApiResponse) => {
  const { type } = req.query;

  if (type === "cat-image") {
    catImageUpload.single("cat-image")(req as any, res as any, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ filename: req.file.filename });
      }
    });
  } else if (type === "product-images") {
    productImagesUpload.array("product-images")(
      req as any,
      res as any,
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).json({ filenames: req.files.map((f) => f.filename) });
        }
      }
    );
  } else {
    res.status(400).json({ error: "Invalid type" });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
