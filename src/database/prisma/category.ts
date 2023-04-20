import type { Category as DBCategory } from "@/types/category";

import prismaClient from "./utils/prismaClient";

type Response<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

type CategoryResponse = Response<DBCategory> | Response<DBCategory[]>;

type FindProps = {
  id?: string;
};

export function find({ id }: FindProps): Promise<CategoryResponse> {
  if (id) {
    return new Promise((resolve, reject) => {
      prismaClient.category
        .findUnique({
          where: {
            id,
          },
        })
        .then((category) => {
          if (!category) {
            return reject({
              success: false,
              message: "Category not found",
            });
          }

          const _category: DBCategory = {
            ...category,
            image: {
              src: category.image,
              alt: category.name,
            },
          };

          resolve({
            success: true,
            data: _category,
          });
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      prismaClient.category.findMany().then((categories) => {
        if (!categories) {
          return reject({
            success: false,
            message: "No categories found",
          });
        }

        const _categories: DBCategory[] = categories.map((category) => {
          return {
            ...category,
            image: {
              src: category.image,
              alt: category.name,
            },
          };
        });

        resolve({
          success: true,
          data: _categories,
        });
      });
    });
  }
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
    prismaClient.category
      .create({
        data: {
          name,
          slug: name.toLowerCase().replace(/ /g, "-"),
          description,
          image: `/images/category/${imageFileName}`,
          numProducts: 0,
          numProductsAndGroups: 0,
        },
      })
      .then((category) => {
        if (!category) {
          return reject({
            success: false,
            message: "Category not found",
          });
        }

        const _category: DBCategory = {
          ...category,
          image: {
            src: category.image,
            alt: category.name,
          },
        };

        resolve({
          success: true,
          data: _category,
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

export function updateCategory({
  id,
  name,
  description,
  imageFileName,
}: UpdateCategoryProps): Promise<CategoryResponse> {
  return new Promise((resolve, reject) => {
    const _update = async () => {
      const oldCategory = await prismaClient.category.findUnique({
        where: {
          id,
        },
      });

      if (!oldCategory) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }

      const newCategory = await prismaClient.category.update({
        where: {
          id,
        },
        data: {
          name,
          slug: name.toLowerCase().replace(/ /g, "-"),
          description,
          ...(imageFileName && {
            image: `/images/category/${imageFileName}`,
          }),
        },
      });

      if (!newCategory) {
        return reject({
          success: false,
          message: "Category not found",
        });
      }

      const _oldCategory = {
        ...oldCategory,
        image: {
          src: oldCategory.image,
          alt: oldCategory.name,
        },
      };

      const _newCategory = {
        ...newCategory,
        image: {
          src: newCategory.image,
          alt: newCategory.name,
        },
      };

      resolve({
        success: true,
        data: [_oldCategory, _newCategory],
      });
    };

    _update();
  });
}

export function deleteCategory(id: string): Promise<CategoryResponse> {
  return new Promise((resolve, reject) => {
    const _delete = async () => {
      const category = await prismaClient.category.findUnique({
        where: {
          id,
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      const numDel =
        await prismaClient.$executeRaw`DELETE FROM "Category" WHERE id = ${id}`;

      if (numDel === 0) {
        throw new Error("Category not found");
      }

      resolve({
        success: true,
        data: {
          ...category,
          image: {
            src: category.image,
            alt: category.name,
          },
        },
      });
    };

    _delete().catch((err) => {
      reject({
        success: false,
        message: err.message,
      });
    });
  });
}
