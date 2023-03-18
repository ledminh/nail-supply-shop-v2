// /api/categories.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '@/types/category';


const categorySample = {
  image: {
    src: "https://loremflickr.com/400/400",
    alt: "Category Image",
  },
  name: "Category Name",
  description: "Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon. Lore ipsum dolor sit amet ronco aenean donec dolor lorem etiam kwon",
};

const categories: Category[] = [
    {
      ...categorySample,
      id: "1",
      slug: "category-1"
    },
    {
      ...categorySample,
      id: "2",
      slug: "category-2"
    },
    {
      ...categorySample,
      id: "3",
      slug: "category-3"
    },
    {
      ...categorySample,
      id: "4",
      slug: "category-4"
    },
    {
      ...categorySample,
      id: "5",
      slug: "category-5"
    },
    {
      ...categorySample,
      id: "6",
      slug: "category-6"
    },
    {
      ...categorySample,
      id: "7",
      slug: "category-7"
    },
    {
      ...categorySample,
      id: "8",
      slug: "category-8"
    },
  ];

export default function handler(req: NextApiRequest, res: NextApiResponse<Category[]>) {
  res.status(200).json(categories);
}
