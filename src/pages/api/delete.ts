// /api/delete.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  switch (req.method) {
    case 'POST':
      const { query: { type, filename } } = req;

      if (type === 'cat-image' && typeof filename === 'string') {
        const baseFilename = path.basename(filename);
        const filePath = path.join(process.cwd(), 'public', 'images', 'category', baseFilename);

        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error(`File not found: ${filePath}`);
            res.status(200).json({ message: 'Image not found or already deleted' });
          }

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${filePath}`);
              res.status(500).json({ message: 'Error deleting image' });
            
            }

            res.status(200).json({ message: 'Image deleted successfully' });
          });
        });
      } else {
        res.status(400).json({ message: 'Invalid type or filename parameter' });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
