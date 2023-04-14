import type { Category } from "@/types/category";
import { getDB } from "../jsons";
import randomId from "@/utils/randomId";

type Response<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

type CategoryResponse = Response<Category> | Response<Category[]>;

type FindProps = {
  id?: string;
};

export function find({ id }: FindProps): Promise<CategoryResponse> {
  if (id) {
    return new Promise((resolve, reject) => {
      getDB().then((db) => {
        const { data } = db;

        if (!data) {
          return reject({
            success: false,
            message: "No orders found",
          });
        }

        const { CATEGORIES } = data;

        const category = CATEGORIES.find((cat) => cat.id === id);

        if (!category) {
          return reject({
            success: false,
            message: "Order not found",
          });
        }

        resolve({
          success: true,
          data: category,
        });
      });
    });
  }

  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No orders found",
        });
      }

      resolve({
        success: true,
        data: data.CATEGORIES,
      });
    });
  });
}

export type CreateCategoryProps = {
  name: string;
  description: string;
  imageFileName: string;
};

export function createCategory({
  name,
  description,
  imageFileName,
}: CreateCategoryProps): Promise<CategoryResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { CATEGORIES } = data;

      const category = {
        id: randomId(10, "cat-"),
        name,
        slug: name.toLowerCase().replace(/ /g, "-"),
        description,
        image: {
          src: `/images/category/${imageFileName}`,
          alt: name,
        },
        numProducts: 0,
      };

      CATEGORIES.push(category);

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data)
            return reject({
              success: false,
              message: "No database found",
            });

          resolve({
            success: true,
            data: category,
          });
        });
    });
  });
}


export type UpdateCategoryProps = {
  id: string;
  name: string;
  description: string;
  imageFileName?: string;
};

export function updateCategory({ id, name, description, imageFileName }: UpdateCategoryProps): Promise<CategoryResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { CATEGORIES } = data;

      const index = CATEGORIES.findIndex((cat) => cat.id === id);
      

      if (index === -1) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }

      const category = CATEGORIES[index];

      const newCategory = {
        ...category,
        name,
        slug: name.toLowerCase().replace(/ /g, "-"),
        description,
      };

      if (imageFileName) {
        newCategory.image = {
          src: `/images/category/${imageFileName}`,
          alt: name,
        };
      }

      CATEGORIES[index] = newCategory;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data)
            return reject({
              success: false,
              message: "No database found",
            });

          resolve({
            success: true,
            data: [category, newCategory],
          });
        });
    });
  });
}




export function deleteCategory(id: string): Promise<CategoryResponse> {
  return new Promise((resolve, reject) => {
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No database found",
        });
      }

      const { CATEGORIES, PRODUCTS } = data;

      const category = CATEGORIES.find((cat) => cat.id === id);

      if (!category) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }

      const productIndexes = PRODUCTS.reduce((acc, product, index) => {
        if (product.categoryID === id) {
          acc.push(index);
        }

        return acc;
      }, [] as number[]);

      const newProducts = PRODUCTS.filter((_, index) => !productIndexes.includes(index));
      data.PRODUCTS = newProducts;

      const index = CATEGORIES.indexOf(category);

      CATEGORIES.splice(index, 1);

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data)
            return reject({
              success: false,
              message: "No database found",
            });

          resolve({
            success: true,
            data: category,
          });
        });
    });
  });
}
