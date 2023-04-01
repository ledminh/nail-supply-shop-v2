import type { NextApiRequest, NextApiResponse } from 'next';

import * as DB from '@/database';





export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            getAboutUsData(res);
            break;
        case 'POST':
            const {query: {type}, body:{content, email, phone, additionalInfos}} = req;
            
            if(type === 'footer') {
                setAboutUsFooter(res, content);    
            } else if (type === 'mission-statement') {
                setAboutUsMissionStatement(res, content);
            } else if (type === 'history') {
                setAboutUsHistoryHTML(res, content);
            } else if (type === 'contact-info') {
                
                setAboutUsContactInfo(res, email, phone, additionalInfos);
            }
            else {
                res.status(400).json({message: 'Invalid request type'});
            }
            break;
        default:
            res.status(400).json({message: 'Invalid request method'});
            break;
    }
}


/****************************
 *  Helper functions
 */

async function getAboutUsData(res: NextApiResponse) {
    const dbRes = await DB.getAboutUsData();

    if(dbRes.success) {
        res.status(200).json(dbRes.data);
    } else {
        res.status(500).json({message: dbRes.message});
    }
    
}

async function setAboutUsFooter(res:NextApiResponse, footer: string) {
    const dbRes = await DB.setAboutUsFooter(footer);

    if(dbRes.success) {
        res.status(200).json({message: 'About us footer updated successfully'});
    } else {
        res.status(500).json({message: dbRes.message});
    }
}

async function setAboutUsMissionStatement(res:NextApiResponse, missionStatement: string) {
    const dbRes = await DB.setAboutUsMissionStatement(missionStatement);

    if(dbRes.success) {
        res.status(200).json({message: 'Mission statement updated successfully'});
    } else {
        res.status(500).json({message: dbRes.message});
    }
}

async function setAboutUsHistoryHTML(res:NextApiResponse, history: string) {
    const dbRes = await DB.setAboutUsHistoryHTML(history);

    if(dbRes.success) {
        res.status(200).json({message: 'History updated successfully'});
    } else {
        res.status(500).json({message: dbRes.message});
    }
}

async function setAboutUsContactInfo(res:NextApiResponse, email: string, phone: string, additionalInfos?: string[]) {
    const dbRes = await DB.setAboutUsContactInfo(email, phone, additionalInfos);

    if(dbRes.success) {
        res.status(200).json({message: 'Contact info updated successfully'});
    } else {
        res.status(500).json({message: dbRes.message});
    }
}