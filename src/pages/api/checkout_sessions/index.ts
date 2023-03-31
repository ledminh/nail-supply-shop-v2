import { OrderedProduct } from "@/types/product";
import { NextApiRequest, NextApiResponse } from "next";
import type { Stripe } from "stripe";



const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);

export type CheckoutResponse = {
    id:string
};

type NextApiCheckoutResponse = NextApiResponse<CheckoutResponse>;

export default async (req: NextApiRequest, res: NextApiCheckoutResponse) => {
    if (req.method === "POST") {
        const { orderedProducts, email } = req.body;

        const line_items = (orderedProducts as OrderedProduct[]).map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [req.headers.origin + product.image.src],
                },
                unit_amount: product.price * 100,
                tax_behavior: "exclusive" as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.TaxBehavior,
            },
            quantity: product.quantity,
        }));


        const params: Stripe.Checkout.SessionCreateParams = {
            mode: "payment",
            submit_type: 'pay',
            
            payment_method_types: ['card'],

            line_items: line_items,
            customer_email: email? email : undefined,
            automatic_tax: {
                enabled: true,
            },

            
            success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            
            cancel_url: `${req.headers.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        
        };

        const session = await stripe.checkout.sessions.create(params);
    

        res.status(200).json({ id: session.id });        


    } 
    else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};
