import type { NextApiRequest, NextApiResponse } from 'next';
import { AboutUsData } from '@/types/others';






export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            res.status(200).json(aboutUsData);
            break;
        case 'POST':
            const {query: {type}, body:{content}} = req;
            
            if(type === 'footer') {
                aboutUsData.aboutUsFooter = content;
                res.status(200).json({message: 'About us footer updated successfully'});    
            } else if (type === 'mission-statement') {
                aboutUsData.missionStatement = content;
                res.status(200).json({message: 'Mission statement updated successfully'});
            } else if (type === 'history') {
                aboutUsData.historyHTML = content;
                res.status(200).json({message: 'History updated successfully'});
            } else if (type === 'contact-info') {
                const {email, phone, additionalInfos} = req.body;
                aboutUsData.contactInfo = {email, phone, additionalInfos};
                res.status(200).json({message: 'Contact info updated successfully'});
            } else {
                res.status(400).json({message: 'Invalid endpoint'});
            }
            break;
        default:
            res.status(400).json({message: 'Invalid request method'});
            break;
    }
}

    



/****************************
 * Database
 */
const aboutUsData: AboutUsData = {
    aboutUsFooter: 'Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. Our mission is to make it easy for our customers to find the products they need to create beautiful and healthy nails. We take pride in offering a wide selection of top-quality products, competitive pricing, and exceptional customer service. Thank you for choosing Nail Essential for all of your nail care needs.',
    missionStatement: 'Our mission is to provide high-quality nail care products to professionals and enthusiasts, making it easy for our customers to find the products they need to create beautiful and healthy nails',
    historyHTML: `<p>Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. It was founded in 2000 by Susan and John Smith, who saw a need for a reliable source of top-quality nail supplies for salons and spas in their area.</p>

    <p>Starting from a small garage in their backyard, they began selling their products to local businesses and quickly gained a reputation for their exceptional customer service and high-quality products. As demand grew, they expanded their business and moved to a larger facility, allowing them to serve customers nationwide.<p>
    
    <p>Over the years, Nail Essential has continued to prioritize quality and customer satisfaction, sourcing the best materials and working closely with manufacturers to ensure that their products meet the highest standards. Today, the company offers a wide selection of top-quality nail care products at competitive prices, along with exceptional customer service and support.</p>
    
    <p>Despite its growth and success, Nail Essential remains committed to its roots as a family-owned business, and continues to operate with the same dedication to quality and customer service that Susan and John started with over 20 years ago.</p>`,

    contactInfo: {
        email: 'info@nailessential.com',
        phone: '1-800-555-5555',
        additionalInfos: [
            'Monday - Friday: 9:00 AM - 5:00 PM EST',
            'Saturday: 10:00 AM - 2:00 PM EST',
            'Sunday: Closed',
        ],
    },
};