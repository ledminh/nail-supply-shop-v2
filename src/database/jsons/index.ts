// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { Order } from "@/types/order";
import { Category } from "@/types/category";
import { DBProduct, DBProductGroup } from "@/types/product";
import { AboutUsData } from "@/types/others";

type Data = {
  ORDERS: Order[];
  ORDER_TEMPS: Order[];
  CATEGORIES: Category[];
  PRODUCTS: (DBProduct | DBProductGroup)[];
  ABOUT_US: AboutUsData
};

// File path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");

// Configure lowdb to write to JSONFile
const adapter = new JSONFile<Data>(file);
const db = new Low(adapter);

// If db.json doesn't exist, db.data will be null
// Use the code below to set default data
// db.data = db.data || { posts: [] } // For Node < v15.x
db.data = db.data || {
  ORDERS: [],
  ORDER_TEMPS: [],
  CATEGORIES: [],
  PRODUCTS: [],
  ABOUT_US: {
    aboutUsFooter: "",
    missionStatement: "",
    historyHTML: "",
    contactInfo: {
      email: "",
      phone: "",
      additionalInfos: [],
    },
  },
}; // For Node >= 15.x

export const getDB = async () => {
  await db.read();

  return db;
};
