import { orderStatus } from "@/config";

import randomId from "@/utils/randomId";
import type { FilterOrder, Order, StatusValue } from "@/types/order";
import prismaClient from "./utils/prismaClient";

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
      const deleteShippingAddress = prismaClient.shippingAddress.delete({
        where: {
          orderID: id,
        },
      });

      const deleteOrderedProducts = prismaClient.orderedProduct.deleteMany({
        where: {
          orderID: id,
        },
      });

      await prismaClient.$transaction([
        deleteShippingAddress,
        deleteOrderedProducts,
      ]);

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
      const returnedOrder = await prismaClient.order.create({
        data: {
          id: randomId(15),
          status: Status.processing,
          dateCreated: new Date(),
          lastUpdated: new Date(),
          temporary: false,
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
              })),
            },
          },
        },

        include: {
          shippingAddress: true,
          orderedProducts: true,
        },
      });

      resolve({
        success: true,
        data: prismaOrderToDBOrder(returnedOrder),
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
          id: order.id,
          status: Status.processing,
          dateCreated: new Date(),
          lastUpdated: new Date(),
          temporary: true,
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
              })),
            },
          },
        },

        include: {
          shippingAddress: true,
          orderedProducts: true,
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
      const deleteShippingAddress = prismaClient.shippingAddress.delete({
        where: {
          orderID: id,
        },
      });

      const deleteOrderedProducts = prismaClient.orderedProduct.deleteMany({
        where: {
          orderID: id,
        },
      });

      await prismaClient.$transaction([
        deleteShippingAddress,
        deleteOrderedProducts,
      ]);

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
    id: order.id,
    shippingAddress: {
      name: order.shippingAddress[0]?.name || "",
      address1: order.shippingAddress[0]?.address1 || "",
      address2: order.shippingAddress[0]?.address2 || "",
      city: order.shippingAddress[0]?.city || "",
      state: order.shippingAddress[0]?.state || "",
      zip: order.shippingAddress[0]?.zip || "",
      email: order.shippingAddress[0]?.email || "",
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
