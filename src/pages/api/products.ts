// /api/products.ts

import {Product, ProductGroup} from '@/types/product';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ProductImage } from '@/types/product';

import fs from 'fs';

import formidable from 'formidable';

import isProduct from '@/utils/isProduct';

import * as DB from '@/database';


export type ProductApiResponse = (Product|ProductGroup)[] | Product | ProductGroup | { message: string };

type NextApiCategoryResponse = NextApiResponse<ProductApiResponse>;

function deleteImages(imagePaths: string[]) {
  for (const imagePath of imagePaths) {
    try {
      if(imagePath.startsWith('/images/product/') && fs.existsSync(`public/images/product/${imagePath}`))
        fs.unlinkSync(`public/images/product/${imagePath}`);
    } catch (err) {
      console.error(`Failed to delete image: ${imagePath}`, err);
    }
  }
}


export default function handler(req: NextApiRequest, res: NextApiCategoryResponse) {

  const { query: { catID } } = req;  

  switch (req.method) {
    case 'GET':

      if(typeof catID === 'string') {
        
        DB.getProducts({catID}).then((products) => {
          res.status(200).json(products);
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
      }

      break;
    
    case 'POST':

      
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
        id: "mem-1",
        name: "Product Name 1",
        price: 100,
      },
      {
        ...productSample,
        id: "mem-2",
        name: "Product Name 2",
        price: 200,
      },
      {
        ...productSample,
        id: "mem-3",
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