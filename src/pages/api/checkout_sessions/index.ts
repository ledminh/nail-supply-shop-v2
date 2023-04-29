import { Order, ShippingAddress, StatusValue } from "@/types/order";
import { OrderedProduct } from "@/types/product";
import { NextApiRequest, NextApiResponse } from "next";
import type { Stripe } from "stripe";
import nextId from "react-id-generator";
import { orderStatus } from "@/config";

import { saveTempOrder } from "@/database";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);

export type CheckoutResponse =
  | {
      success: true;
      id: string;
    }
  | {
      success: false;
      message: string;
    };

type NextApiCheckoutResponse = NextApiResponse<CheckoutResponse>;

async function checkout(req: NextApiRequest, res: NextApiCheckoutResponse) {
  if (req.method === "POST") {
    const { orderedProducts, shippingAddress } = req.body as {
      orderedProducts: OrderedProduct[];
      shippingAddress: ShippingAddress;
    };

    const params = createStripeParams(
      orderedProducts,
      shippingAddress.email,
      req
    );
    const session = await stripe.checkout.sessions.create(params);

    const newOrder: Order = {
      id: session.id,
      shippingAddress: shippingAddress,
      orderedProducts: orderedProducts,
      status: {
        value: "processing",
        lastUpdated: new Date().toISOString(),
        description: orderStatus["processing"],
      },
    };

    const resOrder = await saveTempOrder(newOrder);

    if (!resOrder.success) {
      res.status(500).json({ success: false, message: resOrder.message });
      return;
    }

    res.status(200).json({ success: true, id: session.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default checkout;

function createStripeParams(
  orderedProducts: OrderedProduct[],
  email: string | undefined,
  req: NextApiRequest
) {
  const line_items = orderedProducts.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        images: [req.headers.origin + product.image.src],
      },
      unit_amount: Math.round(product.price) * 100,
      tax_behavior: "exclusive" as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.TaxBehavior,
    },
    quantity: product.quantity,
  }));

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    submit_type: "pay",

    payment_method_types: ["card"],

    line_items: line_items,
    customer_email: email,
    automatic_tax: {
      enabled: true,
    },

    success_url: `${req.headers.origin}/confirmation?temp_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${req.headers.origin}/checkout`,
  };

  return params;
}
