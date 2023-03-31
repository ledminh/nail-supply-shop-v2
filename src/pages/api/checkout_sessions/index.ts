import { NextApiRequest, NextApiResponse } from "next";
import type { Stripe } from "stripe";


const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);

export type CheckoutResponse = {
    id:string
};

type NextApiCheckoutResponse = NextApiResponse<CheckoutResponse>;

export default async (req: NextApiRequest, res: NextApiCheckoutResponse) => {
    if (req.method === "POST") {
        const { amount, email } = req.body;

        const params: Stripe.Checkout.SessionCreateParams = {
            mode: "payment",
            submit_type: 'pay',
            
            payment_method_types: ['card'],

            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "T-shirt",
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            
            success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
            
            cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        
        };

        const session = await stripe.checkout.sessions.create(params);
    

        res.status(200).json({ id: session.id });        


    } 
    else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};
