import { SortType, SortedOrderType } from "@/types/list-conditions";
import isProduct from "@/utils/isProduct";
import type { DBProduct, DBProductGroup } from "@/types/product";

import {getDB} from "@/database/jsons";

import prismaClient from "../utils/prismaClient";
import toDBProduct from "../utils/toDBProduct";
import toDBProductGroup from "../utils/toDBProductGroup";
import { Prisma, Product } from "@prisma/client";



export type FindProductResponse =
  | {
      success: true;
      data: DBProduct | DBProductGroup | (DBProduct | DBProductGroup)[];
    }
  | {
      success: false;
      message: string;
    };

export type FindProductOptions = {
  type: "product" | "group" | "all";
  catID?: string;
  catSlug?: string;
  sort?: SortType;
  sortedOrder?: SortedOrderType;
  offset?: number;
  limit?: number;
  id?: string;
  name?: string;
  groupID?: string;
  searchTerm?: string;
};

export default function find(
  options: FindProductOptions
): Promise<FindProductResponse> {
  return new Promise((resolve, reject) => {

    if(options.searchTerm) {
      // define
      const findSearchTerm = async () => {
        const findProducts = prismaClient.product.findMany({
          where: {
            OR : [
              { name: { contains: options.searchTerm, mode: "insensitive" }},
              { details: { contains: options.searchTerm, mode: "insensitive" }},
              { intro: { contains: options.searchTerm, mode: "insensitive" }},
            ]
          }
        });

        const findGroups = prismaClient.group.findMany({where: { name: { contains: options.searchTerm, mode: "insensitive" }}});


        const [prismaProducts, prismaGroups] = await Promise.all([findProducts, findGroups]);
        
        const prismaProductsInGroups = await prismaClient.product.findMany({ where: { groupID: { in: prismaGroups.map((group) => group.id)}}});

        const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));

        const dbGroups = prismaGroups.map((prismaGroup) => toDBProductGroup(prismaGroup, prismaProductsInGroups));

        const products = [...dbProducts, ...dbGroups];

        resolve({success: true, data: products});

      }

      // execute
      findSearchTerm().catch((err) => reject({success: false, message: err.message}));

    
    }

    else if(options.name) {

      if(options.type === "group") {
        const _find = async () => {
          const prismaGroups = await prismaClient.group.findMany({where: { name: { contains: options.name, mode: "insensitive" }}});

          const prismaProductsInGroups = await prismaClient.product.findMany({ where: { groupID: { in: prismaGroups.map((group) => group.id)}}});

          const dbGroups = prismaGroups.map((prismaGroup) => toDBProductGroup(prismaGroup, prismaProductsInGroups));

          resolve({success: true, data: dbGroups});
        }  

        _find().catch((err) => reject({success: false, message: err.message}));
      }
      else if(options.type === "product") {
        const _find = async () => {
          const prismaProducts = await prismaClient.product.findMany({where: {name: {contains: options.name, mode: "insensitive"}}});

          const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));

          resolve({success: true, data: dbProducts});
        }

        _find().catch((err) => reject({success: false, message: err.message}));
      }
      else {
        const _find = async () => {
          const prismaProducts = await prismaClient.product.findMany({where: {name: {contains: options.name, mode: "insensitive"}}});

          const prismaGroups = await prismaClient.group.findMany({where: { name: { contains: options.name, mode: "insensitive" }}});

          const prismaProductsInGroups = await prismaClient.product.findMany({ where: { groupID: { in: prismaGroups.map((group) => group.id)}}});

          const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));

          const dbGroups = prismaGroups.map((prismaGroup) => toDBProductGroup(prismaGroup, prismaProductsInGroups));

          const products = [...dbProducts, ...dbGroups];

          resolve({success: true, data: products});
        }

        _find().catch((err) => reject({success: false, message: err.message}));  
        
      } 
      
    }

    else if(options.id) {
      if(options.type === "group") {

        const _find = async () => {
          const prismaGroup = await prismaClient.group.findUnique({where: {id: options.id}});
          if(!prismaGroup) return reject({success: false, message: "Group not found"});

          const prismaProductsInGroups = await prismaClient.product.findMany({ where: { groupID: prismaGroup.id}});

          const dbGroup = toDBProductGroup(prismaGroup, prismaProductsInGroups);

          resolve({success: true, data: dbGroup});
        }

        _find().catch((err) => reject({success: false, message: err.message}));
      } 
      else if(options.type === "product") {
        
        const _find = async () => {
          const prismaProduct = await prismaClient.product.findUnique({where: {id: options.id}});
          if(!prismaProduct) return reject({success: false, message: "Product not found"});
          const dbProduct = toDBProduct(prismaProduct);
          resolve({success: true, data: dbProduct});
        }

        _find().catch((err) => reject({success: false, message: err.message}));
        
      }
      else {
        const _find = async () => {
          const prismaProduct = await prismaClient.product.findUnique({where: {id: options.id}});
          
          if(prismaProduct) {
            
            const dbProduct = toDBProduct(prismaProduct);
            resolve({success: true, data: dbProduct});
          }
          else {

            const prismaGroup = await prismaClient.group.findUnique({where: {id: options.id}});
            if(!prismaGroup) return reject({success: false, message: "Group not found"});
            const prismaProductsInGroups = await prismaClient.product.findMany({ where: { groupID: prismaGroup.id}});
            const dbGroup = toDBProductGroup(prismaGroup, prismaProductsInGroups);
            resolve({success: true, data: dbGroup});
          }
        }

        _find().catch((err) => reject({success: false, message: err.message}));
        
      }
    }

    else if(options.groupID) {
      const _find = async () => {
        const prismaProducts = await prismaClient.product.findMany({where: {groupID: options.groupID}});
        const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));
        resolve({success: true, data: dbProducts});
      }

      _find().catch((err) => reject({success: false, message: err.message}));
    }

    else if(options.catID) {

      const _findCatID = async () => {
        
        if(options.sort !== "price" && options.sort !== "sellCount") {
          const sortedOrderQuery = options.sortedOrder === 'asc'? Prisma.sql`ASC` : Prisma.sql`DESC`;

          const ids = await prismaClient.$queryRaw`
          select "id" from 
            ((select "id", "name", "dateCreated", "lastUpdated", "categoryID" from "Product" where "categoryID" = ${options.catID}
              union
            select "id", "name",  "dateCreated", "lastUpdated", "categoryID" from "Group" where "categoryID" = ${options.catID})
            )  as products_and_groups
            order by "name" ${sortedOrderQuery}
            offset ${options.offset}
            limit ${options.limit}
          ` as {id: string}[];

          const prismaProducts = await prismaClient.product.findMany({where: {id: {in: ids.map((id) => id.id)}}});

          const prismaGroups = await prismaClient.group.findMany({where: {id: {in: ids.map((id) => id.id)}}});

          const prismaProductsInGroups = await prismaClient.product.findMany({ where: { groupID: { in: prismaGroups.map((group) => group.id)}}});

          const dbGroups = prismaGroups.map((prismaGroup) => toDBProductGroup(prismaGroup, prismaProductsInGroups));

          const dbProducts = prismaProducts.filter(p => !p.groupID).map((prismaProduct) => toDBProduct(prismaProduct));

          let products = [...dbProducts, ...dbGroups];

          if(options.sort)
            products = sortProducts(products, options.sort);

          if(options.sortedOrder === "desc")
            products = products.reverse();

          resolve({success: true, data: products});
        }
        else {
          const sortedOrderQuery = options.sortedOrder === 'asc'? Prisma.sql`ASC` : Prisma.sql`DESC`;
          
          const result = await prismaClient.$queryRaw`
            SELECT * from  "Product"
            WHERE "categoryID" = ${options.catID}
            ORDER BY ${options.sort} ${sortedOrderQuery}
            offset ${options.offset}
            limit ${options.limit}
          ` as Product[];

          const prismaProducts = result.filter((product) => !product.groupID);
          const prismaProductsInGroups = result.filter((product) => product.groupID);

          const prismaGroups = await prismaClient.group.findMany({where: {id: {in: prismaProductsInGroups.map((product) => product.groupID) as string[]}}});


          const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));
          const dbGroups = prismaGroups.map((prismaGroup) => toDBProductGroup(prismaGroup, prismaProductsInGroups));

          let products = [...dbProducts, ...dbGroups];

          if(options.sort)
            products = sortProducts(products, options.sort);

          if(options.sortedOrder === "desc")
            products = products.reverse();

          resolve({success: true, data: products});
        }
      
      }

      _findCatID().catch((err) => reject({success: false, message: err.message}));

    }


    else if(options.catSlug) {
      
      const _findCatSlug = async () => {

        if(options.sort !== "price" && options.sort !== "sellCount") {
          
          const { offset = 0, limit = 1000, catSlug, sort = 'name', sortedOrder = 'asc' } = options;

          const sortedOrderQuery = sortedOrder === 'asc'? Prisma.sql`ASC` : Prisma.sql`DESC`;
        
          const ids = await prismaClient.$queryRaw`
            SELECT "id" FROM (
              SELECT "id", "name", "dateCreated", "lastUpdated", "categoryID"
                FROM "Product" 
                WHERE "categoryID" in (SELECT "id" FROM "Category" WHERE "slug" = ${catSlug}) 
              
              UNION

              SELECT "id", "name", "dateCreated", "lastUpdated", "categoryID"
                FROM "Group" 
                WHERE "categoryID" in (SELECT "id" FROM "Category" WHERE "slug" = ${catSlug}) 
                
            ) AS products_and_groups
            ORDER BY ${sort} ${sortedOrderQuery}
            OFFSET ${offset}
            LIMIT ${limit}
          ` as {id: string}[];          

 
          const prismaProducts = await prismaClient.product.findMany({where: {id: {in: ids.map(id => id.id)}}});

          const prismaGroups = await prismaClient.group.findMany({where: {id: {in: ids.map(id => id.id)}}});

          const prismaProductsInGroups = await prismaClient.product.findMany({ where: { groupID: { in: prismaGroups.map((group) => group.id)}}});

          const dbGroups = prismaGroups.map((prismaGroup) => toDBProductGroup(prismaGroup, prismaProductsInGroups));

          const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));

          let products = [...dbProducts, ...dbGroups];

          if(options.sort)
            products = sortProducts(products, options.sort);

          if(options.sortedOrder === "desc")
            products = products.reverse();


          resolve({success: true, data: products});
        }
        else {
          const sortedOrderQuery = options.sortedOrder === 'asc'? Prisma.sql`ASC` : Prisma.sql`DESC`;

          const results = await prismaClient.$queryRaw`
            SELECT * FROM "Product"
            WHERE "categoryID" IN (SELECT "id" FROM "Category" WHERE "slug" = ${options.catSlug})
            ORDER BY ${options.sort} ${sortedOrderQuery}
            OFFSET ${options.offset}
            LIMIT ${options.limit}
          ` as Product[];

          const prismaProducts = results.filter((product) => !product.groupID);
          const prismaProductsInGroups = results.filter((product) => product.groupID);

          const prismaGroups = await prismaClient.group.findMany({where: {id: {in: prismaProductsInGroups.map((product) => product.groupID) as string[]}}});
          
          const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));
          const dbGroups = prismaGroups.map((prismaGroup) => toDBProductGroup(prismaGroup, prismaProductsInGroups));

          let products = [...dbProducts, ...dbGroups];

          if(options.sort)
            products = sortProducts(products, options.sort);

          if(options.sortedOrder === "desc")
            products = products.reverse();

          resolve({success: true, data: products});
        }

      }

      _findCatSlug().catch((err) => reject({success: false, message: err.message}));
      
    }

    else {
      // find  products base on options.sort, options.sortedOrder, options.type, options.limit with prisma
      const _find = async () => {
        const { offset = 0, limit = 1000, catSlug, sort = 'name', sortedOrder = 'asc' } = options;

          const sortedOrderQuery = sortedOrder === 'asc'? Prisma.sql`ASC` : Prisma.sql`DESC`;
        
          const productsPrisma = await prismaClient.$queryRaw`
            SELECT * FROM "Product"
            ORDER BY ${sort} ${sortedOrderQuery}
            OFFSET ${offset}
            LIMIT ${limit}
          ` as Product[];

          const products = productsPrisma.map((prismaProduct) => toDBProduct(prismaProduct));          

          resolve({success: true, data: products});
      }

      _find().catch((err) => reject({success: false, message: err.message}));
    }
    




  });


}


/******************
 * Helpers
 */



function sortProducts(
  products: (DBProduct | DBProductGroup)[],
  sort: SortType
) {
  return products.sort((a, b) => {
    if (sort === "name") {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    } else if (sort === "price") {
      const aPrice = isProduct(a) ? a.price : a.products[0].price;
      const bPrice = isProduct(b) ? b.price : b.products[0].price;

      if (aPrice < bPrice) {
        return -1;
      }
      if (aPrice > bPrice) {
        return 1;
      }
      return 0;
    } else if (sort === "dateCreated") {
      const aDate = new Date(a.dateCreated);
      const bDate = new Date(b.dateCreated);

      if (aDate < bDate) {
        return -1;
      }
      if (aDate > bDate) {
        return 1;
      }
      return 0;
    } else if (sort === "sellCount") {
      const aSellCount = isProduct(a) ? a.sellCount : a.products[0].sellCount;
      const bSellCount = isProduct(b) ? b.sellCount : b.products[0].sellCount;

      if (aSellCount < bSellCount) {
        return -1;
      }
      if (aSellCount > bSellCount) {
        return 1;
      }
      return 0;
    } else if (sort === "lastUpdated") {
      // if lasUpdated is undefined, then it has never been updated
      const aLastUpdated = a.lastUpdated
        ? new Date(a.lastUpdated)
        : new Date(a.dateCreated);
      const bLastUpdated = b.lastUpdated
        ? new Date(b.lastUpdated)
        : new Date(b.dateCreated);

      if (aLastUpdated < bLastUpdated) {
        return -1;
      }
      if (aLastUpdated > bLastUpdated) {
        return 1;
      }
      return 0;
    } else {
      return 0;
    }
  });


}