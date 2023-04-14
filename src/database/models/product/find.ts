import { SortType, SortedOrderType } from "@/types/list-conditions";
import isProduct from "@/utils/isProduct";
import type { DBProduct, DBProductGroup } from "@/types/product";

import productsJSON from "@/database/jsons/products.json";

import { getDB } from "@/database/jsons";


const PRODUCTS = productsJSON as (DBProduct | DBProductGroup)[];

export type FindProductResponse =
| {
    success: true;
    data: DBProduct | DBProductGroup | (DBProduct | DBProductGroup)[];
}
|{
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
};

export default function find(
    options: FindProductOptions
): Promise<FindProductResponse> {

    return new Promise((resolve, reject) => {
        getDB().then((db) => {
            const { data } = db;

            if (!data) {
                return reject({
                    success: false,
                    message: "No database found",
                });
            }

            const { PRODUCTS, CATEGORIES } = data;

            let products = filterProductsByType(PRODUCTS, options.type);


            if (options.name) {
                products = filterProductsByName(products, options.name);

                if (products.length === 0) {
                return reject({ success: false, message: "Product not found" });
                }

                return resolve({ success: true, data: products });
            }

            if (options.id) {
                const product = products.find((product) => product.id === options.id);

                if (product) {
                    return resolve({ success: true, data: product });
                }

                return reject({ success: false, message: "Product not found" });
            }

            if (options.groupID) {
                const _products = products.filter(
                (product) => isProduct(product) && product.groupID === options.groupID
                );

                if (_products) {
                    return resolve({ success: true, data: _products as DBProduct[] });
                }

                return reject({ success: false, message: "Product group not found" });
            }

                    
            if (options.catID) {
                products = products.filter(
                    (product) => product.categoryID === options.catID
                );
            }

                    
            if (options.catSlug) {
                const category = CATEGORIES.find(
                    (category) => category.slug === options.catSlug
                );


                if(!category) {
                    return reject({ success: false, message: "Category not found" });
                }

                products = products.filter(
                    (product) => product.categoryID === category.id
                );

            }

            if (options.sort) {
                products = sortProducts(products, options.sort);
            }

            if (options.sortedOrder === "desc") {
                products = products.reverse();
            }

            if (options.offset) {
                products = products.slice(options.offset);
            }

            if (options.limit) {
                products = products.slice(0, options.limit);
            }

            return resolve({ success: true, data: products });

        });
        
    });    
}


/******************
 * Helpers
 */
function flatOutProducts(products: (DBProduct | DBProductGroup)[]) {
    let _products: (DBProduct | DBProductGroup)[] = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        if (isProduct(product)) {
            _products.push(product);
        } else {
            _products = [..._products, ...product.products];
        }
    }

    return _products;
}

function filterProductsByType(
    products: (DBProduct | DBProductGroup)[],
    type: "product" | "group" | "all"
) {

    if (type === "product") {
        return flatOutProducts(products).filter((product) => isProduct(product));
    } else if (type === "group") {
        return products.filter((product) => !isProduct(product));
    } else  { // all
        return products;
    }
}

function filterProductsByName(products: (DBProduct | DBProductGroup)[], name: string) {
    return products.filter((product) => product.name.toLowerCase().includes(name.toLowerCase()));
}

function sortProducts(products: (DBProduct | DBProductGroup)[], sort: SortType) {
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
        } else if (sort === 'lastUpdated') {
            // if lasUpdated is undefined, then it has never been updated
            const aLastUpdated = a.lastUpdated ? new Date(a.lastUpdated) : new Date(a.dateCreated);
            const bLastUpdated = b.lastUpdated ? new Date(b.lastUpdated) : new Date(b.dateCreated);

            if (aLastUpdated < bLastUpdated) {
                return -1;
            }
            if (aLastUpdated > bLastUpdated) {
                return 1;
            }
            return 0;
            
        }
        
        else {
            return 0;
        }
    });
}