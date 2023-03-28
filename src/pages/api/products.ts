// /api/products.ts

import {Product, ProductGroup} from '@/types/product';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ProductImage } from '@/types/product';

import fs from 'fs';

import formidable from 'formidable';

import isProduct from '@/utils/isProduct';

import * as DB from '@/database';


export type ProductApiResponse = {
  success: true,
  products?: undefined,
  message: string
} | {
  success: true,
  products: (Product|ProductGroup)[],
  message?: undefined
} | {
  success: false,
  message: string
};

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

  const { query: { type, catID } } = req;  

  switch (req.method) {
    case 'GET':

      if(typeof catID === 'string') {        
        getProducts(catID, res);
      }

      break;
    
    case 'POST':
      if(type === 'delete-single-product') {
        const { id } = req.query;

        if(typeof id !== 'string')  
          return res.status(400).json({ success:false, message: 'Invalid product ID' });

        deleteSingleProduct(id, res);
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



/***************************
 * Function helpers
 */

const getProducts = (catID: string, res:NextApiCategoryResponse) => {
  DB.getProducts({catID}).then((products) => {
    if(!Array.isArray(products)) {
      return res.status(500).json({ 
          success: false, 
          message: 'Something went wrong' 
        });
    } 

    return res.status(200).json({ success: true, products });
  }).catch((err) => {
    return res.status(500).json({success: false, message: err.message});
  });
}


const deleteSingleProduct = (id: string, res:NextApiCategoryResponse) => {
  DB.getProduct({id}).then((product) => {
    if(product) {

      if(Array.isArray(product) || !isProduct(product)) return;


      deleteImages(product.images.map((image) => image.src));

      DB.deleteProduct({id}).then(() => {
        res.status(200).json({ success: true, message: 'Product deleted' });
      }).catch((err) => {
        res.status(500).json({ success: false, message: err.message });
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  }).catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });

}
