import type { NextApiRequest, NextApiResponse } from "next";

import * as DB from "@/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const {
            query: { type },
            body: { content, email, phone, additionalInfos },
        } = req;

        if (type === "footer") {
            setAboutUsFooter(res, content);
        } else if (type === "mission-statement") {
            setAboutUsMissionStatement(res, content);
        } else if (type === "history") {
            setAboutUsHistoryHTML(res, content);
        } else if (type === "contact-info") {
            setAboutUsContactInfo(res, email, phone, additionalInfos);
        } else {
            res.status(400).json({ success: false, message: "Invalid request type" });
        }
    }
    else {
        res.status(400).json({ success: false, message: "Invalid request method" });
    }
}

/****************************
 *  Helper functions
 */


async function setAboutUsFooter(res: NextApiResponse, footer: string) {
    const dbRes = await DB.setAboutUsFooter({footer});

    if (dbRes.success) {
        res.status(200).json({ success: true, footer: dbRes.data });
    } else {
        res.status(500).json({ success: false, message: dbRes.message });
    }
}

async function setAboutUsMissionStatement(res: NextApiResponse, missionStatement: string
) {
    const dbRes = await DB.setAboutUsMissionStatement({missionStatement});

    if (dbRes.success) {
        res.status(200).json({success: true, aboutUsMission: dbRes.data });
    } else {
        res.status(500).json({ success: false, message: dbRes.message });
    }
}

async function setAboutUsHistoryHTML(res: NextApiResponse, history: string) {
    const dbRes = await DB.setAboutUsHistoryHTML({history});

    if (dbRes.success) {
        res.status(200).json({ success: true, historyHTML: dbRes.data });
    } else {
        res.status(500).json({ success: false, message: dbRes.message });
    }
}

async function setAboutUsContactInfo(
    res: NextApiResponse,
    email: string,
    phone: string,
    additionalInfos?: string[]
) {
    const contactInfo = { email, phone, additionalInfos };
    const dbRes = await DB.setAboutUsContactInfo({ contactInfo });

    if (dbRes.success) {
        res.status(200).json({ success: true, contactInfo: dbRes.data });
    } else {
        res.status(500).json({ success: false, message: dbRes.message });
    }
}