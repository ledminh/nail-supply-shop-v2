import { ContactInfo } from "@/types/others";

import { Order } from "@/types/order";

import { useEffect } from "react";

import PageLayout from "@/components/layouts/PageLayout";

import styles from "@/styles/pages/Confirmation.module.scss";

import { saveOrder, deleteTempOrder } from "@/database";

import ShippingAddressCPN from "@/components/basics/ShippingAddress";
import OrderSummary from "@/components/composites/OrderSummary";

import Link from "next/link";
import { getAboutUsData } from "@/database";

import { useCart } from "@/contexts/CartContext";

import { GetServerSideProps } from "next";

import { getTempOrder, updateProductQuantity } from "@/database";

export interface Props {
  errorMessage?: string;
  contactInfo: ContactInfo;
  aboutUsFooter: string;
  order: Order;
}

export default function Confirmation({
  errorMessage,
  contactInfo,
  aboutUsFooter,
  order,
}: Props) {
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    deleteShippingAddressFromLocalStorage();
  }, []);

  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <div className={styles.wrapper}>
        <section className={styles.header}>
          <h2 className={styles.title}>ORDER CONFIRMATION</h2>
          <h3 className={styles.orderNumber}>
            Order Number: <span className={styles.value}>{order.id}</span>
          </h3>
        </section>
        <section className={styles.shippingAddress}>
          <p>Thank you for your purchase!</p>
          <p>
            Your order has been confirmed and will be shipped to the following
            address:
          </p>
          <ShippingAddressCPN shippingAddress={order.shippingAddress} />
        </section>
        <section className={styles.orderSummary}>
          <OrderSummary orderedProducts={order.orderedProducts} />
        </section>
        <section className={styles.text}>
          <p>
            You can check the status of your order{" "}
            <Link
              href={"/order/" + order.id}
              className={styles.linkToOrderPage}
            >
              HERE
            </Link>
          </p>
          <p>
            Please remember your order number to contact our customer service by
            email at {contactInfo.email}, or by phone at {contactInfo.phone}.
          </p>
          <p>
            Thank you for choosing Nail Essential for all of your nail care
            needs!
          </p>
        </section>
      </div>
    </PageLayout>
  );
}

Confirmation.displayName = "Confirmation";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { temp_id } = context.query;

  if (typeof temp_id !== "string") {
    return {
      props: {
        errorMessage: "Invalid confirmation id",
      },
    };
  }

  try {
    const [aboutUsRes, orderRes] = await Promise.all([
      getAboutUsData(),
      getTempOrder(temp_id),
    ]);

    if (!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message,
        },
      };
    }


    if (!orderRes.success) {
      return {
        props: {
          errorMessage: orderRes.message,
        },
      };
    }


    const quantityData = orderRes.data.orderedProducts.map((product) => {
      return {
        productID: product.id,
        quantity: product.quantity,
      };
    });


    const saveRes = await saveOrder(orderRes.data);


    const deleteRes = await deleteTempOrder(temp_id);


    const updateQuantityRes = await updateProductQuantity(quantityData);


    if (!updateQuantityRes.success) {
      return {
        props: {
          errorMessage: updateQuantityRes.message,
        },
      };
    }


    if (!saveRes.success) {
      return {
        props: {
          errorMessage: saveRes.message,
        },
      };
    }


    if (!deleteRes.success) {
      return {
        props: {
          errorMessage: deleteRes.message,
        },
      };
    }


    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    const newOrder = saveRes.data!;


    return {
      props: {
        contactInfo,
        aboutUsFooter,
        order: newOrder,
      },
    };
  } catch (err: any) {
    return {
      props: {
        errorMessage: err.message,
      },
    };
  }
};

/******************************
 * Helper functions
 */

// delete shipping address from local storage
export function deleteShippingAddressFromLocalStorage() {
  localStorage.removeItem("shippingAddress");
}
