import { NextApiRequest, NextApiResponse } from "next";

import { getAuth } from "@clerk/nextjs/server";
import formidable from "formidable";
import uploadFile from "@/utils/supaUpload";
import fs from "fs";
import PersistentFile from "formidable/PersistentFile";

// // const imageFilter = (
// //   req: any,
// //   file: Express.Multer.File,
// //   cb: FileFilterCallback
// // ) => {
// //   if (file.mimetype.startsWith("image/")) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only image files are allowed"));
// //   }
// // };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId || userId !== process.env.ADMIN_ID) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { type } = req.query;

  switch (req.method) {
    case "POST":
      if (type === "cat-image") {
        catImageUpload(req, res);
      } else if (type === "product-images") {
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

// // apiRoute.post((req: MulterRequest, res: NextApiResponse) => {
// //   const { type } = req.query;

// //   if (type === "cat-image") {
// //     catImageUpload.single("cat-image")(req as any, res as any, (err) => {
// //       if (err) {
// //         res.status(500).json({ error: err.message });
// //       } else {
// //         res.status(200).json({ filename: req.file.filename });
// //       }
// //     });
// //   } else if (type === "product-images") {
// //     productImagesUpload.array("product-images")(
// //       req as any,
// //       res as any,
// //       (err) => {
// //         if (err) {
// //           res.status(500).json({ error: err.message });
// //         } else {
// //           res.status(200).json({ filenames: req.files.map((f) => f.filename) });
// //         }
// //       }
// //     );
// //   } else {
// //     res.status(400).json({ error: "Invalid type" });
// //   }
// // });

/*****************************
 * Helper functions
 */

const catImageUpload = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    } else {
      const catImageFile = files["cat-image"] as formidable.File;

      const fileContent = await fs.promises.readFile(catImageFile.filepath);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `cat-image-${uniqueSuffix}`;

      const { data, error } = await uploadFile(
        "nail-supply-store",
        `category/${fileName}.${
          catImageFile.mimetype ? catImageFile.mimetype.split("/")[1] : "jpeg"
        }`,
        fileContent,
        {
          contentType: catImageFile.mimetype || "image/jpeg",
          cacheControl: "3600",
        }
      );

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const filename = `${process.env.SUPABASE_IMAGE_URL}/${data.path}`;

      return res.status(200).json({ success: true, filename });
    }
  });
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
