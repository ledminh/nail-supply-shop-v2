import { orderStatus } from "@/config";
import { getDB } from "../jsons";

import type { FilterOrder, Order, StatusValue } from "@/types/order";
import prismaClient from "./utils/prismaClient";

import randomId from "@/utils/randomId";
import { Status } from "@prisma/client";

type OrderResponse = Promise<
  | {
      success: true;
      data: Order | Order[];
    }
  | {
      success: false;
      message: string;
    }
>;

type FindProps = {
  id?: string;
};

export function find({ id }: FindProps): OrderResponse {
  return new Promise((resolve, reject) => {
    const _find = async () => {
      if (id) {
        const order = await prismaClient.order.findUnique({
          where: {
            id,
          },
          include: {
            orderedProducts: true,
            shippingAddress: true,
          },
        });

        if (!order) {
          return reject({
            success: false,
            message: "Order not found",
          });
        }

        resolve({
          success: true,
          data: prismaOrderToDBOrder(order),
        });
      } else {
        const orders = await prismaClient.order.findMany({
          include: {
            orderedProducts: true,
            shippingAddress: true,
          },
        });

        if (!orders) {
          return reject({
            success: false,
            message: "No orders found",
          });
        }

        resolve({
          success: true,
          data: orders.map((order) => prismaOrderToDBOrder(order)),
        });
      }
    };

    _find().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

export function deleteOrder(id: string): OrderResponse {
  return new Promise((resolve, reject) => {
    const _deleteOrder = async () => {
      const order = await prismaClient.order.delete({
        where: {
          id,
        },
        include: {
          orderedProducts: true,
          shippingAddress: true,
        },
      });

      if (!order) {
        return reject({
          success: false,
          message: "Order not found",
        });
      }

      const deleteOrderedProducts = prismaClient.orderedProduct.deleteMany({
        where: {
          orderID: id,
        },
      });

      const deleteShippingAddress = prismaClient.shippingAddress.delete({
        where: {
          id: order.shippingAddress.id,
        },
      });

      await Promise.all([deleteOrderedProducts, deleteShippingAddress]);

      resolve({
        success: true,
        data: prismaOrderToDBOrder(order),
      });
    };

    _deleteOrder().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

export function add(order: Order): OrderResponse {
  return new Promise(async (resolve, reject) => {
    // use prismaClient to create order
    const _add = async () => {
      const newOrder = await prismaClient.order.create({
        data: {
          ...order,
          id: randomId(),
          shippingAddress: {
            create: {
              ...order.shippingAddress,
            },
          },
          orderedProducts: {
            createMany: {
              data: order.orderedProducts.map((product) => ({
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                image: product.image.src,
                orderID: order.id,
              })),
            },
          },
          status:
            order.status.value === "processing"
              ? Status.processing
              : order.status.value === "shipped"
              ? Status.shipped
              : Status.delivered,
          dateCreated: new Date(),
          lastUpdated: new Date(),
          temporary: false,
        },
        include: {
          orderedProducts: true,
          shippingAddress: true,
        },
      });

      resolve({
        success: true,
        data: prismaOrderToDBOrder(newOrder),
      });
    };

    _add().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

export function updateStatus(id: string, status: StatusValue): OrderResponse {
  return new Promise((resolve, reject) => {
    // use prismaClient to update order status
    const _updateStatus = async () => {
      const order = await prismaClient.order.update({
        where: {
          id,
        },
        data: {
          status: Status[status],
        },
        include: {
          orderedProducts: true,
          shippingAddress: true,
        },
      });

      resolve({
        success: true,
        data: prismaOrderToDBOrder(order),
      });
    };

    _updateStatus().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

export function filter({
  status,
  month,
  year,
  sort,
  query,
}: FilterOrder): OrderResponse {
  return new Promise((resolve, reject) => {
    let where = {};

    if (query !== "") {
      where = {
        ...where,
        id: {
          contains: query,
        },
      };
    }

    if (status !== "all") {
      where = {
        ...where,
        status: {
          equals: Status[status],
        },
      };
    }

    if (month !== null) {
      const monthQuery = month.substring(0, month.indexOf("/"));
      const yearQuery = month.substring(month.indexOf("/") + 1);

      where = {
        ...where,
        lastUpdated: {
          gte: new Date(`${monthQuery}/01/${yearQuery}`),
          lt: new Date(`${monthQuery}/31/${yearQuery}`),
        },
      };
    }

    if (year !== null) {
      where = {
        ...where,
        lastUpdated: {
          gte: new Date(`01/01/${year}`),
          lt: new Date(`12/31/${year}`),
        },
      };
    }

    const _filter = async () => {
      const orders = await prismaClient.order.findMany({
        where,
        include: {
          shippingAddress: true,
          orderedProducts: true,
        },
        orderBy: {
          lastUpdated: sort === "oldest" ? "asc" : "desc",
        },
      });

      resolve({
        success: true,
        data: orders.map((order) => prismaOrderToDBOrder(order)),
      });
    };

    _filter().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

/*************************
 * Temp Order Functions
 *************************/

type TempOrderResponse = Promise<
  | {
      success: true;
      data: Order;
    }
  | {
      success: false;
      message: string;
    }
>;

export function saveTemp(order: Order): TempOrderResponse {
  return new Promise(async (resolve, reject) => {
    const _saveTemp = async () => {
      const returnedOrder = await prismaClient.order.create({
        data: {
          ...order,
          shippingAddress: {
            create: {
              ...order.shippingAddress,
            },
          },
          orderedProducts: {
            createMany: {
              data: order.orderedProducts.map((product) => ({
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                image: product.image.src,
                orderID: order.id,
              })),
            },
          },
          status:
            order.status.value === "processing"
              ? Status.processing
              : order.status.value === "shipped"
              ? Status.shipped
              : Status.delivered,
          dateCreated: new Date(),
          lastUpdated: new Date(),
          temporary: true,
        },
        include: {
          orderedProducts: true,
          shippingAddress: true,
        },
      });

      resolve({
        success: true,
        data: prismaOrderToDBOrder(returnedOrder),
      });
    };

    _saveTemp().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

export function findTemp(id: string): TempOrderResponse {
  return new Promise(async (resolve, reject) => {
    const _findTemp = async () => {
      const returnedOrder = await prismaClient.order.findUnique({
        where: {
          id,
        },
        include: {
          orderedProducts: true,
          shippingAddress: true,
        },
      });

      if (!returnedOrder) {
        return reject({
          success: false,
          message: "Order not found",
        });
      }

      return resolve({
        success: true,
        data: prismaOrderToDBOrder(returnedOrder),
      });
    };

    _findTemp().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

export function deleteTemp(id: string): TempOrderResponse {
  return new Promise(async (resolve, reject) => {
    const _deleteTemp = async () => {
      const returnedOrder = await prismaClient.order.delete({
        where: {
          id,
        },
        include: {
          orderedProducts: true,
          shippingAddress: true,
        },
      });

      if (!returnedOrder) {
        return reject({
          success: false,
          message: "Order not found",
        });
      }

      const deleteOrderedProducts = prismaClient.orderedProduct.deleteMany({
        where: {
          orderID: id,
        },
      });

      const deleteShippingAddress = prismaClient.shippingAddress.delete({
        where: {
          id: returnedOrder.shippingAddress.id,
        },
      });

      return resolve({
        success: true,
        data: prismaOrderToDBOrder(returnedOrder),
      });
    };

    _deleteTemp().catch((error) => {
      reject({
        success: false,
        message: error.message,
      });
    });
  });
}

/************************
 * Helper Functions
 */

function prismaOrderToDBOrder(order: any): Order {
  return {
    ...order,
    shippingAddress: {
      ...order.shippingAddress,
      address2: order.shippingAddress.address2 || "",
    },
    orderedProducts: order.orderedProducts.map((product: any) => ({
      ...product,
      image: {
        src: product.image,
        alt: product.name,
      },
    })),
    status: {
      value: order.status,
      lastUpdated: order.lastUpdated.toISOString(),
      description: orderStatus[order.status as Status],
    },
  };
}
