import type { NextApiRequest, NextApiResponse } from "next";

import * as DB from "@/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === "GET") {
    getAboutUsData(res);
  }
  else {
    res.status(400).json({ message: "Invalid request method" });
  }
  
}

/****************************
 *  Helper functions
 */

async function getAboutUsData(res: NextApiResponse) {
  const dbRes = await DB.getAboutUsData();

  if (dbRes.success) {
    res.status(200).json(dbRes.data);
  } else {
    res.status(500).json({ message: dbRes.message });
  }
}