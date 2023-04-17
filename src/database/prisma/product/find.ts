import { SortType, SortedOrderType } from "@/types/list-conditions";
import isProduct from "@/utils/isProduct";
import type { DBProduct, DBProductGroup } from "@/types/product";

import {getDB} from "@/database/jsons";

import prismaClient from "../utils/prismaClient";
import toDBProduct from "../utils/toDBProduct";
import toDBProductGroup from "../utils/toDBProductGroup";



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

    if(options.name) {

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

    if(options.id) {
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

    if(options.groupID) {
      const _find = async () => {
        const prismaProducts = await prismaClient.product.findMany({where: {groupID: options.groupID}});
        const dbProducts = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));
        resolve({success: true, data: dbProducts});
      }

      _find().catch((err) => reject({success: false, message: err.message}));
    }

    if(options.catID) {

      const _findCatID = async () => {
        
        if(options.sort !== "price" && options.sort !== "sellCount") {
          const ids = await prismaClient.$queryRaw`
          select "id" from 
            ((select "id", "name", "dateCreated", "lastUpdated", "categoryID" from "Product" where "categoryID" = \'${options.catID}\'
              union
            select "id", "name",  "dateCreated", "lastUpdated", "categoryID" from "Group" where "categoryID" = \'${options.catID}\')
            )  as products_and_groups
          ` as string[];

          const prismaProducts = await prismaClient.product.findMany({where: {id: {in: ids}}});

          const prismaGroups = await prismaClient.group.findMany({where: {id: {in: ids}}});

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
          const ids = await prismaClient.$queryRaw`
          select * from  'Product'
          where "categoryID" = ${options.catID}
          order by ${options.sort} ${options.sortedOrder}
          offset ${options.offset}
          limit ${options.limit}
          ` as string[];

          const prismaProducts = await prismaClient.product.findMany({where: {id: {in: ids}}});

          const products = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));

          resolve({success: true, data: products});
        }
      
      }

      _findCatID().catch((err) => reject({success: false, message: err.message}));

    }


    if(options.catSlug) {
      
      const _findCatSlug = async () => {

        if(options.sort !== "price" && options.sort !== "sellCount") {
          console.log(options);

          const ids = await prismaClient.$queryRaw`
            select id from 
              ((select "id", "name", "dateCreated", "lastUpdated", "categoryID" from "Product" where "categoryID" = (select "id" from "Category" where "slug" = \'${options.catSlug}\')
                union
              select "id", "name",  "dateCreated", "lastUpdated", "categoryID" from "Group" where "categoryID" = (select "id" from "Category" where "slug" = \'${options.catSlug}\')
              ) 
              offset ${options.offset? options.offset : 0}
              limit ${options.limit? options.limit : 1000}) as products_and_groups
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
          const ids = await prismaClient.$queryRaw`
          select * from  'Product'
          where "categoryID" = (select "id" from "Category" where "slug" = \'${options.catSlug}\')
          offset ${options.offset? options.offset : 0}
          limit ${options.limit? options.limit : 1000}
          ` as {id: string}[];

          const prismaProducts = await prismaClient.product.findMany({where: {id: {in: ids.map(id => id.id)}}});

          const products = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));

          resolve({success: true, data: products});
        }

      }

      _findCatSlug().catch((err) => reject({success: false, message: err.message}));
      
    }

    // find  products base on options.sort, options.sortedOrder, options.type, options.limit with prisma
    const _find = async () => {
      if(options.sort !== 'price' && options.sort !== 'sellCount') {
        const ids = await prismaClient.$queryRaw`
        select "id" from
          ((select "id", "name", "dateCreated", "lastUpdated", "categoryID" from "Product"
            union
          select "id", "name",  "dateCreated", "lastUpdated", "categoryID" from "Group")
          ) as products_and_groups
          offset ${options.offset? options.offset : 0}
          limit ${options.limit? options.limit : 1000}
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
        const ids = await prismaClient.$queryRaw`
        select * from  "Product"
        offset ${options.offset? options.offset : 0}
        limit ${options.limit? options.limit : 1000}
        ` as {id:string}[];

        const prismaProducts = await prismaClient.product.findMany({where: {id: {in: ids.map(id => id.id)}}});

        const products = prismaProducts.map((prismaProduct) => toDBProduct(prismaProduct));

        resolve({success: true, data: products});
      }
    }

    _find().catch((err) => reject({success: false, message: err.message}));




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