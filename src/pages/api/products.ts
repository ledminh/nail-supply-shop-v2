// /api/products.ts

import {Product, ProductGroup} from '@/types/product';
import type { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';

export type ProductApiResponse = (Product|ProductGroup)[] | Product | ProductGroup | { message: string };

type NextApiCategoryResponse = NextApiResponse<ProductApiResponse>;


export default function handler(req: NextApiRequest, res: NextApiCategoryResponse) {

  switch (req.method) {
    case 'GET':
      res.status(200).json(products);
      break;
    // case 'POST':
    //   const { query: { type, id: catID } } = req;

    //   if (type === 'delete') {
    //     if (typeof catID !== 'string') {
    //       res.status(400).json({ message: 'Invalid category ID' });
    //       break;
    //     }

    //     const categoryIndex = categories.findIndex((category) => category.id === catID);

    //     if (categoryIndex === -1) {
    //       res.status(404).json({ message: 'Category not found' });
    //       break;
    //     }

    //     categories.splice(categoryIndex, 1);
    //     res.status(200).json(categories);
    //     break;
    //   } 
    //   else if (type === 'create') {
    //     const form = new formidable.IncomingForm();
                
    //     form.parse(req, (err, fields) => {
    //       if (err) {
    //         res.status(500).json({ message: err.message });
    //         return;
    //       }

    //       const { name, description, imageFileName } = fields;
          
    //       const newCategory: Category = {
    //         id: (Math.max(...categories.map((c) => parseInt(c.id, 10))) + 1).toString(),
    //         slug: `category-${(name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    //         name: name as string,
    //         description: description as string,
    //         image: {
    //           src: `/images/category/${imageFileName}`,
    //           alt: name as string,
    //         },
    //       };

    //       categories.push(newCategory);
    //       res.status(200).json(newCategory);
    //     });

    //   }
    //   else if (type === 'update') {
    //     const form = new formidable.IncomingForm();

    //     form.parse(req, (err, fields) => {
    //       if (err) {
    //         res.status(500).json({ message: err.message });
    //         return;
    //       }

    //       const { id, name, description, imageFileName } = fields;

    //       const categoryIndex = categories.findIndex((category) => category.id === id);

    //       if (categoryIndex === -1) {
    //         res.status(404).json({ message: 'Category not found' });
    //         return;
    //       }

    //       // user did not change the image
    //       if(!imageFileName) {
    //         categories[categoryIndex] = {
    //           ...categories[categoryIndex],
    //           name: name as string,
    //           description: description as string,
    //         };
    //         res.status(200).json(categories[categoryIndex]);
    //         return;
    //       }

    //       categories[categoryIndex] = {
    //         ...categories[categoryIndex],
    //         name: name as string,
    //         description: description as string,
    //         image: imageFileName === 'undefined' ? categories[categoryIndex].image :{
    //           src: `/images/category/${imageFileName}`,
    //           alt: name as string,
    //         },
    //       };


    //       res.status(200).json(categories);
    //     });
    //   }
    //   else {
    //     res.status(400).json({ message: 'Invalid type parameter' });
    //   }
    //   break;
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


const productSample = {
  id: "1",
  name: "Product Name",
  price: 100,
  intro: "This is some intro text. I'm trying to make it longer to see if it fit on the frame",
  details: "This is some details text. I'm trying to make it longer to see if it fit on the frame. Something more to say here to make it longer, and even longer, longer, longer",
  categoryID: "1",
  images: [
    {
      id: "img-1",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 1"
    },
    {
      id: "img-2",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 2"
    },
    {
      id: "img-3",
      src: "https://picsum.photos/seed/picsum/200/200",
      alt: "Product Image 3"
    }
  ]
}

const productSamples = [
  {
    ...productSample,
    id: "1"
  },
  {
    ...productSample,
    id: "2"
  },
  {
    ...productSample,
    id: "3"
  },
  {
    ...productSample,
    id: "4"
  },
  {
    ...productSample,
    id: "5"
  }
]

const products:(Product|ProductGroup)[] = [
  {
    ...productSample,
    id: "1"
  },
  {
    name: "Product Group Name",
    categoryID: "1",
    products: [
      {
        ...productSample,
        id: "1",
        name: "Product Name 1",
        price: 100,
      },
      {
        ...productSample,
        id: "2",
        name: "Product Name 2",
        price: 200,
      },
      {
        ...productSample,
        id: "3",
        name: "Product Name 3",
        price: 300,
      },
    ],
    id: "2"
  },
  {
    ...productSample,
    id: "3"
  },
  {
    ...productSample,
    id: "4"
  },
  {
    ...productSample,
    id: "5"
  }
]