import { SortType, SortedOrderType } from "@/types/list-conditions";
import isProduct from "@/utils/isProduct";
import type { DBProduct, DBProductGroup } from "@/types/product";

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
  const ASC = Prisma.sql`ASC`;
  const DESC = Prisma.sql`DESC`;
  const NAME = Prisma.sql`"name"`;
  const DATE_CREATED = Prisma.sql`"dateCreated"`;
  const LAST_UPDATED = Prisma.sql`"lastUpdated"`;
  const PRICE = Prisma.sql`price`;
  const SELL_COUNT = Prisma.sql`"sellCount"`;
  const ID = Prisma.sql`"id"`;

  return new Promise((resolve, reject) => {
    if (options.searchTerm) {
      // define
      const findSearchTerm = async () => {
        const dbProductPromise = findDBProducts({
          OR: [{ name: { contains: options.searchTerm, mode: "insensitive" } }],
        });

        const dbGroupPromise = findDBGroups({
          name: { contains: options.searchTerm, mode: "insensitive" },
        });

        const [dbProducts, dbGroups] = await Promise.all([
          dbProductPromise,
          dbGroupPromise,
        ]);

        if (!dbProducts || !dbGroups) {
          throw new Error("Error finding products or groups");
        }

        let products = [...dbProducts, ...dbGroups];

        products = sortProducts(products, "name");

        resolve({ success: true, data: products });
      };

      // execute
      findSearchTerm().catch((err) =>
        reject({ success: false, message: err.message })
      );
    } 
    
    else if (options.name) {
      if (options.type === "group") {
        const _find = async () => {
          const dbGroups = await findDBGroups({
            name: { contains: options.name, mode: "insensitive" },
          });

          if (!dbGroups) {
            throw new Error("Error finding groups by name");
          }

          resolve({ success: true, data: dbGroups });
        };

        _find().catch((err) =>
          reject({ success: false, message: err.message })
        );
      } else if (options.type === "product") {
        const _find = async () => {
          const dbProducts = await findDBProducts({
            name: { contains: options.name, mode: "insensitive" },
          });

          if (!dbProducts) {
            throw new Error("Error finding products by name");
          }

          resolve({ success: true, data: dbProducts });
        };

        _find().catch((err) =>
          reject({ success: false, message: err.message })
        );
      } else {
        const _find = async () => {
          const dbProductsPromise = findDBProducts({
            name: { contains: options.name, mode: "insensitive" },
          });

          const dbGroupsPromise = findDBGroups({
            name: { contains: options.name, mode: "insensitive" },
          });

          const [dbProducts, dbGroups] = await Promise.all([
            dbProductsPromise,
            dbGroupsPromise,
          ]);

          if (!dbProducts || !dbGroups) {
            throw new Error("Error finding products or groups by name");
          }

          let products = [...dbProducts, ...dbGroups];

          products = sortProducts(products, "name");

          resolve({ success: true, data: products });
        };

        _find().catch((err) =>
          reject({ success: false, message: err.message })
        );
      }
    } 
    
    else if (options.id) {
      if (options.type === "group") {
        const _find = async () => {
          const dbGroup = await findDBGroup({ id: options.id });

          if (!dbGroup) {
            throw new Error("Error finding group by id");
          }

          resolve({ success: true, data: dbGroup });
        };

        _find().catch((err) =>
          reject({ success: false, message: err.message })
        );
      } else if (options.type === "product") {
        const _find = async () => {
          const dbProduct = await findDBProduct({ id: options.id });

          if (!dbProduct) {
            throw new Error("Error finding product by id");
          }
          resolve({ success: true, data: dbProduct });
        };

        _find().catch((err) =>
          reject({ success: false, message: err.message })
        );
      } else {
        const _find = async () => {
          const dbProduct = await findDBProduct({ id: options.id });

          if (dbProduct) {
            resolve({ success: true, data: dbProduct });
          } else {
            const dbGroup = await findDBGroup({ id: options.id });

            if (!dbGroup) {
              throw new Error("Error finding product or group by id");
            }

            resolve({ success: true, data: dbGroup });
          }
        };

        _find().catch((err) =>
          reject({ success: false, message: err.message })
        );
      }
    } 
    
    else if (options.groupID) {
      const _find = async () => {
        const dbProducts = await findDBProducts({ groupID: options.groupID });

        if (!dbProducts) {
          throw new Error("Error finding products by group id");
        }

        resolve({ success: true, data: dbProducts });
      };

      _find().catch((err) => reject({ success: false, message: err.message }));
    } 
    
    else if (options.catID) {
      
      const _findCatID = async () => {
        if (options.sort !== "price" && options.sort !== "sellCount") {
          
          const sortedOrderQuery =
            options.sortedOrder === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

            const sortQuery =
            options.sort === "name"
              ? NAME
              : options.sort === "dateCreated"
              ? DATE_CREATED
              : LAST_UPDATED;

          const ids = (await prismaClient.$queryRaw`
          select "id" from 
            ((select "id", "name", "dateCreated", "lastUpdated", "categoryID" from "Product" where "categoryID" = ${options.catID} and "groupID" is null
              union
            select "id", "name",  "dateCreated", "lastUpdated", "categoryID" from "Group" where "categoryID" = ${options.catID})
            )  as products_and_groups
            order by ${sortQuery} ${sortedOrderQuery} NULLS LAST, ${ID} ${sortedOrderQuery} NULLS LAST
            offset ${options.offset}
            limit ${options.limit}
          `) as { id: string }[];

          const dbProductsPromise = findDBProducts({
            id: { in: ids.map((id) => id.id) },
          });

          const dbGroupsPromise = findDBGroups({
            id: { in: ids.map((id) => id.id) },
          });

          const [dbProducts, dbGroups] = await Promise.all([ dbProductsPromise, dbGroupsPromise]);

          if (!dbProducts || !dbGroups) {
            throw new Error("Error finding products or groups by category id");
          }

          let products = [...dbProducts, ...dbGroups];


          if (options.sort) products = sortProducts(products, options.sort);

          if (options.sortedOrder === "desc") products = products.reverse();

          resolve({ success: true, data: products });
        } else {
          const sortedOrderQuery =
            options.sortedOrder === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

          const sortQuery = options.sort === "price" ? PRICE : SELL_COUNT;

          const prismaProducts = (await prismaClient.$queryRaw`
            SELECT * from  "Product"
            WHERE "categoryID" = ${options.catID}
            ORDER BY ${sortQuery} ${sortedOrderQuery} NULLS LAST, ${ID} ${sortedOrderQuery} NULLS LAST
            offset ${options.offset}
            limit ${options.limit}
          `) as Product[];

          let products = prismaProducts.map(toDBProduct) as (
            | DBProduct
            | DBProductGroup
          )[];

          if (options.sort) products = sortProducts(products, options.sort);

          if (options.sortedOrder === "desc") products = products.reverse();

          resolve({ success: true, data: products });
        }
      };

      _findCatID().catch((err) =>
        reject({ success: false, message: err.message })
      );
    } 
    
    else if (options.catSlug) {
      const _findCatSlug = async () => {
        const {
          offset = 0,
          limit = 1000,
          catSlug,
          sort = "name",
          sortedOrder = "asc",
        } = options;

        if (options.sort !== "price" && options.sort !== "sellCount") {
          const sortedOrderQuery = sortedOrder === "asc" ? ASC : DESC;

          const sortQuery =
            sort === "name"
              ? NAME
              : sort === "dateCreated"
              ? DATE_CREATED
              : LAST_UPDATED;

          const ids = (await prismaClient.$queryRaw`
            SELECT "id", "name" FROM (
              SELECT "id", "name", "dateCreated", "lastUpdated", "categoryID"
                FROM "Product" 
                WHERE "categoryID" in (SELECT "id" FROM "Category" WHERE "slug" = ${catSlug}) and "groupID" is null 

              UNION

              SELECT "id", "name", "dateCreated", "lastUpdated", "categoryID"
                FROM "Group" 
                WHERE "categoryID" in (SELECT "id" FROM "Category" WHERE "slug" = ${catSlug})
                
            ) AS products_and_groups
            ORDER BY ${sortQuery} ${sortedOrderQuery} NULLS LAST, ${ID} ${sortedOrderQuery} NULLS LAST
            OFFSET ${offset}
            LIMIT ${limit}
          `) as { id: string; name: string }[];

          const dbProductsPromise = findDBProducts({
            id: { in: ids.map((id) => id.id) },
          });

          const dbGroupsPromise = findDBGroups({
            id: { in: ids.map((id) => id.id) },
          });

          const [dbProducts, dbGroups] = await Promise.all([
            dbProductsPromise,
            dbGroupsPromise,
          ]);

          if (!dbProducts || !dbGroups) {
            throw new Error(
              "Error finding products or groups by category slug"
            );
          }

          let products = [...dbProducts, ...dbGroups];

          if (options.sort) products = sortProducts(products, options.sort);

          if (options.sortedOrder === "desc") products = products.reverse();

          resolve({ success: true, data: products });
        } else {
          const sortedOrderQuery =
            sortedOrder === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

          const sortQuery =
            sort === "price" ? Prisma.sql`"price"` : Prisma.sql`"sellCount"`;

          const prismaProducts = (await prismaClient.$queryRaw`
            SELECT * FROM "Product"
            WHERE "categoryID" IN (SELECT "id" FROM "Category" WHERE "slug" = ${options.catSlug})
            ORDER BY ${sortQuery} ${sortedOrderQuery} NULLS LAST, ${ID} ${sortedOrderQuery} NULLS LAST
            OFFSET ${options.offset}
            LIMIT ${options.limit}
          `) as Product[];

          let products = prismaProducts.map(toDBProduct) as (
            | DBProduct
            | DBProductGroup
          )[];

          if (options.sort) products = sortProducts(products, options.sort);

          if (options.sortedOrder === "desc") products = products.reverse();

          resolve({ success: true, data: products });
        }
      };

      _findCatSlug().catch((err) =>
        reject({ success: false, message: err.message })
      );
    } 
    
    else {
      // find  products base on options.sort, options.sortedOrder, options.type, options.limit with prisma
      const _find = async () => {
        const {
          offset = 0,
          limit = 1000,
          catSlug,
          sort = "name",
          sortedOrder = "asc",
        } = options;

        const sortedOrderQuery =
          sortedOrder === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;
        const sortQuery =
          sort === "name"
            ? NAME
            : sort === "dateCreated"
            ? DATE_CREATED
            : sort === "lastUpdated"
            ? LAST_UPDATED
            : sort === "price"
            ? PRICE
            : sort === "sellCount"
            ? SELL_COUNT
            : null;

        const productsPrisma = (await prismaClient.$queryRaw`
            SELECT * FROM "Product"
            ORDER BY ${sortQuery} ${sortedOrderQuery} NULLS LAST, ${ID} ${sortedOrderQuery} NULLS LAST
            OFFSET ${offset}
            LIMIT ${limit}
          `) as Product[];

        const products = productsPrisma.map((prismaProduct) =>
          toDBProduct(prismaProduct)
        );

        resolve({ success: true, data: products });
      };

      _find().catch((err) => reject({ success: false, message: err.message }));
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

async function findDBGroup(whereCondition: Prisma.GroupWhereUniqueInput) {
  const prismaGroup = await prismaClient.group.findUnique({
    where: whereCondition,
  });

  if (!prismaGroup) return null;

  const prismaProductsInGroup = await prismaClient.product.findMany({
    where: { groupID: prismaGroup.id },
  });

  const dbGroup = toDBProductGroup(prismaGroup, prismaProductsInGroup);

  return dbGroup;
}

async function findDBGroups(whereCondition: Prisma.GroupWhereInput) {
  const prismaGroups = await prismaClient.group.findMany({
    where: whereCondition,
  });

  if (!prismaGroups) return null;

  const prismaProductsInGroups = await prismaClient.product.findMany({
    where: { groupID: { in: prismaGroups.map((group) => group.id) } },
  });

  const dbGroups = prismaGroups.map((prismaGroup) =>
    toDBProductGroup(prismaGroup, prismaProductsInGroups)
  );

  return dbGroups;
}

async function findDBProduct(whereCondition: Prisma.ProductWhereUniqueInput) {
  const prismaProduct = await prismaClient.product.findUnique({
    where: whereCondition,
  });

  if (!prismaProduct) return null;

  const dbProduct = toDBProduct(prismaProduct);

  return dbProduct;
}

async function findDBProducts(whereCondition: Prisma.ProductWhereInput) {
  const prismaProducts = await prismaClient.product.findMany({
    where: whereCondition,
  });

  if (!prismaProducts) return null;

  const dbProducts = prismaProducts.map((prismaProduct) =>
    toDBProduct(prismaProduct)
  );

  return dbProducts;
}
