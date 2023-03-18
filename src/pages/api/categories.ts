// /api/categories.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '@/types/category';

const sampleCategories: Category[] = [
  {
    id: '1',
    slug: 'electronics',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    image: {
      src: 'https://example.com/electronics.jpg',
      alt: 'Electronics',
    },
  },
  {
    id: '2',
    slug: 'fashion',
    name: 'Fashion',
    description: 'Clothing, shoes, and accessories',
    image: {
      src: 'https://example.com/fashion.jpg',
      alt: 'Fashion',
    },
  },
  // Add more sample categories if needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse<Category[]>) {
  res.status(200).json(sampleCategories);
}
