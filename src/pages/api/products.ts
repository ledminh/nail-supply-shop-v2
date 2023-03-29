// /api/products.ts

import {Product, ProductGroup} from '@/types/product';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ProductImage, DBProduct, DBProductGroup } from '@/types/product';

import fs from 'fs';

import formidable from 'formidable';

import isProduct from '@/utils/isProduct';

import * as DB from '@/database';


export type ProductApiResponse = {
  success: true,
  products?: undefined,
  product?: undefined,
  message: string
} | {
  success: true,
  products: (Product|ProductGroup)[],
  product?: undefined,
  message?: undefined
} | {
  success: true,
  products?: undefined,
  product: Product|ProductGroup,
  message?: undefined
} |
{
  success: false,
  message: string
};

type NextApiCategoryResponse = NextApiResponse<ProductApiResponse>;

function deleteImages(imagePaths: string[]) {
  for (const imagePath of imagePaths) {
    try {

      if(imagePath.startsWith('/images/product/')) {
        const imgName = imagePath.replace('/images/product/', '');

        if(fs.existsSync(`public/images/product/${imgName}`)) {
          fs.unlink(`public/images/product/${imgName}`, (err) => {
            if(err) {
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

        return deleteSingleProduct(id, res);
      }
      
      if(type === 'delete-group') {
        const { id } = req.query;

        if(typeof id !== 'string')
          return res.status(400).json({ success:false, message: 'Invalid group ID' });

          return deleteGroup(id, res);
      }

      if(type === 'add-product') {
        addProduct(req, res);
      }
      
      if(type === 'add-group') {
        addGroup(req, res);
      }

      if(type === 'update-product') {
        updateProduct(req, res);
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
          message: 'Products is not an array' 
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

const deleteGroup = (id: string, res:NextApiCategoryResponse) => {
  DB.getProduct({id}).then((group) => {
    if(group) {

      if(Array.isArray(group) || isProduct(group)) return;

      const images = group.products.reduce((acc: ProductImage[], product) => {
        acc.push(...product.images);

        return acc;
      }, []);


      deleteImages(images.map((image) => image.src));

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


const addProduct = (req: NextApiRequest, res: NextApiCategoryResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(500).json({ success: false, message: err.message });
    }  

    const { serialNumber, categoryID, name, intro, details, price, images } = fields;


    if(typeof serialNumber !== 'string'
      || typeof categoryID !== 'string'  
      || typeof name !== 'string'
      || typeof intro !== 'string' 
      || typeof details !== 'string' 
      || typeof price !== 'string'
      || typeof images !== 'string') {
        return res.status(400).json({ success: false, message: 'Missing fields' });
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
      sellCount: 0
    }

    DB.addProduct({product}).then(() => {
      return res.status(200).json({ success: true, product: product });
    }).catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });

  });
}


const addGroup = (req: NextApiRequest, res: NextApiCategoryResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    


    const { name, categoryID, products} = fields;


    if(typeof name !== 'string'
      || typeof products !== 'string'
      || typeof categoryID !== 'string') {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const group: DBProductGroup = {
      id: 'prod-' + generateID(),
      name,
      categoryID,
      products: JSON.parse(products),
      dateCreated: new Date().toISOString(),
      
    }

    DB.addGroup({group}).then((group) => {
      return res.status(200).json({ success: true, product: group });
    }).catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });

  });
}

const updateProduct = (req: NextApiRequest, res: NextApiCategoryResponse) => {

  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(500).json({ success: false, message: err.message });
    }  

    const { serialNumber, categoryID, groupID, name, intro, details, price, images } = fields;


    if(typeof serialNumber !== 'string'
      || typeof categoryID !== 'string'  
      || typeof name !== 'string'
      || typeof intro !== 'string' 
      || typeof details !== 'string' 
      || typeof price !== 'string'
      || typeof images !== 'string') {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const newImages:ProductImage[] = JSON.parse(images);

    if(typeof groupID === 'string') {
      DB.getProduct({id: groupID}).then((group) => {
        if(!group || Array.isArray(group) || isProduct(group)) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const oldProduct = group.products.find((product) => product.id === serialNumber);

        if(!oldProduct) {
          return res.status(404).json({ success: false, message: 'Product not found' });
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
          sellCount: oldProduct.sellCount
        }

        DB.updateGroupProduct({groupID, product: newProduct}).then(() => {
          return res.status(200).json({ success: true, product: newProduct });
        }).catch((err) => {
          return res.status(500).json({ success: false, message: err.message });
        });

      }).catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });

    }


    DB.getProduct({id: serialNumber}).then((product) => {
      if(!product || Array.isArray(product) || !isProduct(product)) {
        return res.status(404).json({ success: false, message: 'Product not found' });
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
        dateCreated: product.dateCreated,
        sellCount: product.sellCount
      }
      
      DB.updateProduct({product: newProduct}).then(() => {
        return res.status(200).json({ success: true, product: newProduct });
      }).catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });


    });




    

  });


}

    


const generateID = () => {
  return Math.random().toString(36).substring(2, 13);
}