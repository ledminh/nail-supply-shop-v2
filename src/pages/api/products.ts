// /api/products.ts

import {Product, ProductGroup} from '@/types/product';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ProductImage } from '@/types/product';

import fs from 'fs';

import formidable from 'formidable';

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

const isProduct = (product: Product|ProductGroup): product is Product => {
  return "images" in product;
}

export default function handler(req: NextApiRequest, res: NextApiCategoryResponse) {

  switch (req.method) {
    case 'GET':
      res.status(200).json(products);
      break;
    case 'POST':
      const { query: { type, productID, productGroupID } } = req;

      if (type === 'delete') {
        if (typeof productID === "string") {
          const productIndex = products.findIndex((product) => product.id === productID);
      
          if (productIndex === -1) {
            res.status(404).json({ message: "Product not found" });
            break;
          }
        
          // Delete the product images
          if (isProduct(products[productIndex])) {
            const images = (products[productIndex] as Product).images;
            deleteImages(images.map((image) => image.src));
          }
        
          
          products.splice(productIndex, 1);
  
          res.status(200).json(products);
          return;
        }
        else if (typeof productGroupID === "string") {
          const productGroupIndex = products.findIndex((product) => product.id === productGroupID);
      
          if (productGroupIndex === -1) {
            res.status(404).json({ message: "Product group not found" });
            break;
          }
        
          // Delete the product group images
          const images = (products[productGroupIndex] as ProductGroup).products.flatMap((product) => product.images);
          deleteImages(images.map((image) => image.src));
        
          products.splice(productGroupIndex, 1);
  
          res.status(200).json(products);
          return;
        }
        else {
          res.status(400).json({ message: "Invalid product ID" });
          break;
        }
      

      }
      else if (type === 'update') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields) => {
          if (err) {
            res.status(500).json({ message: err.message });
            return;
          }

          const { id,
            serialNumber,
            name,
            intro,
            details,
            price,
            images } = fields;

          // if(productGroupID) {
          //   const productGroupIndex = products.findIndex((product) => product.id === productGroupID);

          //   if (productGroupIndex === -1) {
          //     res.status(404).json({ message: 'Product group not found' });
          //     return;
          //   }

          //   const productIndex = (products[productGroupIndex] as ProductGroup).products.findIndex((product) => product.id === id);

          //   if (productIndex === -1) {
          //     res.status(404).json({ message: 'Product not found' });
          //     return;
          //   }

          //   const oldImages = (products[productGroupIndex] as ProductGroup).products[productIndex].images;
          //   const newImages = JSON.parse(images as string) as ProductImage[];

          //   // filter out the images that are not in the new image list
          //   const imagePaths = oldImages
          //     .filter((image) => !newImages.some((newImage) => newImage.src === image.src))
          //     .map((image) => image.src);


          //   deleteImages(imagePaths);


          //   (products[productGroupIndex] as ProductGroup).products[productIndex] = {
          //     ...(products[productGroupIndex] as ProductGroup).products[productIndex],
          //     id: serialNumber as string,
          //     name: name as string,
          //     intro: intro as string,
          //     details: details as string,
          //     price: parseInt(price as string, 10),
          //     images: newImages,
          //   };

          //   res.status(200).json(products[productGroupIndex]);

          //   return;
          // }



          const productIndex = products.findIndex((product) => product.id === id);

          if (productIndex === -1) {
            res.status(404).json({ message: 'Product not found' });
            return;
          }


          const oldImages = (products[productIndex] as Product).images;
          const newImages = JSON.parse(images as string) as ProductImage[];

          // filter out the images that are not in the new image list
          const imagePaths = oldImages
            .filter((image) => !newImages.some((newImage) => newImage.src === image.src))
            .map((image) => image.src);


          deleteImages(imagePaths);


          products[productIndex] = {
            ...products[productIndex],
            id: serialNumber as string,
            name: name as string,
            intro: intro as string,
            details: details as string,
            price: parseInt(price as string, 10),
            images: newImages,
          };

          res.status(200).json(products[productIndex]);
          return;
          
        });
      } 
      else if (type === 'create') {
        // const form = new formidable.IncomingForm();
                
        // form.parse(req, (err, fields) => {
        //   if (err) {
        //     res.status(500).json({ message: err.message });
        //     return;
        //   }

        //   const { name, description, imageFileName } = fields;
          
        //   const newCategory: Category = {
        //     id: (Math.max(...categories.map((c) => parseInt(c.id, 10))) + 1).toString(),
        //     slug: `category-${(name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        //     name: name as string,
        //     description: description as string,
        //     image: {
        //       src: `/images/category/${imageFileName}`,
        //       alt: name as string,
        //     },
        //   };

        //   categories.push(newCategory);
        //   res.status(200).json(newCategory);
        // });

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