// /api/categories.ts

import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '@/types/category';

import formidable from 'formidable';

import * as DB from '@/database';

export type CategoryApiResponse = {
  success: true;
  categories?: Category[];
  category?: Category;
} | {
  success: false;
  message: string;
};


type NextApiCategoryResponse = NextApiResponse<CategoryApiResponse>;

const deleteImage = (filename: string) => {
  const baseFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), "public", "images", "category", baseFilename);

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


export default function handler(req: NextApiRequest, res: NextApiCategoryResponse) {
  
  switch (req.method) {
    case 'GET':
      getCategories(res);
      break;
    case 'POST':
      const { query: { type, id: catID } } = req;

      if (type === "delete") {
        if (typeof catID !== "string") {
          res.status(400).json({ success: false, message: "Invalid category ID" });
          break;
        }

        deleteCategory(catID, res);
        break;
      }
      // else if (type === 'create') {
      //   const form = new formidable.IncomingForm();
                
      //   form.parse(req, (err, fields) => {
      //     if (err) {
      //       res.status(500).json({ message: err.message });
      //       return;
      //     }

      //     const { name, description, imageFileName } = fields;
          
      //     const newCategory: Category = {
      //       id: (Math.max(...categories.map((c) => parseInt(c.id, 10))) + 1).toString(),
      //       slug: `category-${(name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      //       name: name as string,
      //       description: description as string,
      //       image: {
      //         src: `/images/category/${imageFileName}`,
      //         alt: name as string,
      //       },
      //     };

      //     categories.push(newCategory);
      //     res.status(200).json(newCategory);
      //   });

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
      else {
        res.status(400).json({ success: false, message: 'Invalid type parameter' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

/**********************
 * Helper Functions
 */

function getCategories(res: NextApiCategoryResponse) {
  DB.getCategories().then((dbRes) => {
    if(!dbRes.success) {
      res.status(500).json({ success: false, message: dbRes.message });
      return;
    }
    const categories = dbRes.data;

    res.status(200).json({
      success: true,
      categories:categories as Category[],

    });

  }).catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });

}

function deleteCategory(catID: string, res: NextApiCategoryResponse) {
  DB.deleteCategory(catID).then((dbRes) => {
    if(!dbRes.success) {
      res.status(500).json({ success: false, message: dbRes.message });
      return;
    }

    res.status(200).json({ success: true, categories: dbRes.data as Category[] });

  }).catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });
}

