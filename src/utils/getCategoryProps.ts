import { Category } from "@/types/category";

const getCategoryProps = ({
  categories,
  categoryID,
  props,
}: {
  categories: Category[];
  categoryID: string;
  props: Array<keyof Category>;
}) => {
  const category = categories.find((category) => category.id === categoryID);

  if (!category) {
    throw new Error(
      `Category not found categoryID: ${categoryID} ${JSON.stringify(
        categories
      )}`
    );
  }

  const categoryProps: Partial<Category> = {};

  props.forEach((prop) => {
    categoryProps[prop] = category[prop] as any;
  });

  return categoryProps;
};

export default getCategoryProps;
