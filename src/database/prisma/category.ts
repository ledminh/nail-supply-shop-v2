import type { Category } from "@/types/category";
import { getDB } from "../jsons";
import randomId from "@/utils/randomId";

import prismaClient from "./prismaClient";

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

          const _category = {
            ...category,
            image: {
              src: category.image,
              alt: category.name,
            },
          }

          resolve({
            success: true,
            data: _category,
          });
        });
    });
  }
  else {
    return new Promise((resolve, reject) => {
      prismaClient.category
        .findMany()
        .then((categories) => {
          if (!categories) {
            return reject({
              success: false,
              message: "No categories found",
            });
          }
  
          const _categories = categories.map((category) => {
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
        },
      })
      .then((category) => {
        if (!category) {
          return reject({
            success: false,
            message: "Category not found",
          });
        }

        const _category = {
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
    prismaClient.category
      .update({
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
      })
      .then((category) => {
        if (!category) {
          return reject({
            success: false,
            message: "Category not found",
          });
        }

        const _category = {
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

export function deleteCategory(id: string): Promise<CategoryResponse> {
  
  return new Promise((resolve, reject) => {
    prismaClient.category
      .delete({
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

        const _category = {
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
