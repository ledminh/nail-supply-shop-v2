// /api/categories.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '@/types/category';

import formidable from 'formidable';

export type CategoryApiResponse = Category[] | Category | { message: string };
type NextApiCategoryResponse = NextApiResponse<CategoryApiResponse>;


export default function handler(req: NextApiRequest, res: NextApiCategoryResponse) {

  switch (req.method) {
    case 'GET':
      res.status(200).json(categories);
      break;
    case 'POST':
      const { query: { type, id: catID } } = req;

      if (type === 'delete') {
        if (typeof catID !== 'string') {
          res.status(400).json({ message: 'Invalid category ID' });
          break;
        }

        const categoryIndex = categories.findIndex((category) => category.id === catID);

        if (categoryIndex === -1) {
          res.status(404).json({ message: 'Category not found' });
          break;
        }

        categories.splice(categoryIndex, 1);
        res.status(200).json(categories);
        break;
      } 
      else if (type === 'create') {
        const form = new formidable.IncomingForm();
                
        form.parse(req, (err, fields) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }

          const { name, description, imageFileName } = fields;
          
          const newCategory: Category = {
            id: (Math.max(...categories.map((c) => parseInt(c.id, 10))) + 1).toString(),
            slug: `category-${(name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            name: name as string,
            description: description as string,
            image: {
              src: `/images/category/${imageFileName}`,
              alt: name as string,
            },
          };

          categories.push(newCategory);
          res.status(200).json(newCategory);
        });

      }
      else if (type === 'update') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }

          const { id, name, description, imageFileName } = fields;

          const categoryIndex = categories.findIndex((category) => category.id === id);

          if (categoryIndex === -1) {
            res.status(404).json({ message: 'Category not found' });
            return;
          }

          // user did not change the image
          if(!imageFileName) {
            categories[categoryIndex] = {
              ...categories[categoryIndex],
              name: name as string,
              description: description as string,
            };
            res.status(200).json(categories[categoryIndex]);
            return;
          }

          categories[categoryIndex] = {
            ...categories[categoryIndex],
            name: name as string,
            description: description as string,
            image: imageFileName === 'undefined' ? categories[categoryIndex].image :{
              src: `/images/category/${imageFileName}`,
              alt: name as string,
            },
          };


          res.status(200).json(categories);
        });
      }
      else {
        res.status(400).json({ message: 'Invalid type parameter' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const categorySample = {
  image: {
    src: "https://loremflickr.com/400/400",
    alt: "Category Image",
  },
  name: "Category Name",
  description: "Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon",
};

const categories: Category[] = [
    {
      ...categorySample,
      id: "1",
      slug: "category-1"
    },
    {
      ...categorySample,
      id: "2",
      slug: "category-2"
    },
    {
      ...categorySample,
      id: "3",
      slug: "category-3"
    },
    {
      ...categorySample,
      id: "4",
      slug: "category-4"
    },
    {
      ...categorySample,
      id: "5",
      slug: "category-5"
    },
    {
      ...categorySample,
      id: "6",
      slug: "category-6"
    },
    {
      ...categorySample,
      id: "7",
      slug: "category-7"
    },
    {
      ...categorySample,
      id: "8",
      slug: "category-8"
    },
  ];


