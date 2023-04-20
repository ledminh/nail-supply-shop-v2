import type { NextApiRequest, NextApiResponse } from "next";

import { AboutUsData } from "@/types/others";

import * as DB from "@/database";

type AboutUsResponse =
  | {
      success: true;
      aboutUs: AboutUsData;
    }
  | {
      success: false;
      message: string;
    };

type NextAboutUsApiResponse = NextApiResponse<AboutUsResponse>;

export default function handler(
  req: NextApiRequest,
  res: NextAboutUsApiResponse
) {
  if (req.method === "GET") {
    getAboutUsData(res);
  } else {
    res.status(400).json({ success: false, message: "Invalid request method" });
  }
}

/****************************
 *  Helper functions
 */

async function getAboutUsData(res: NextAboutUsApiResponse) {
  const dbRes = await DB.getAboutUsData();

  if (dbRes.success) {
    res.status(200).json({ success: true, aboutUs: dbRes.data });
  } else {
    res.status(500).json({ success: false, message: dbRes.message });
  }
}
