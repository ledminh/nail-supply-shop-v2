import OrderControl from "@/components/composites/OrderControl";
import OrderList from "@/components/composites/OrderList";
import styles from "@styles/sections/OrderManagementSection.module.scss";
import { orderStatus } from "@/config";

import { useState, useEffect } from "react";
import { Order, StatusValue } from "@/types/order";

import { MONTH_ITEMS, YEAR_ITEMS } from "./data";

import axios from "axios";

import { FilterOrder } from "@/types/order";
import { FilterChangeOptions } from "@/components/composites/OrderControl/type";

export interface Props {}

const initFilter: FilterOrder = {
  status: "all",
  month: MONTH_ITEMS[0].value,
  year: null,
  sort: "newest",
  query: "",
};

export default function OrderManagementSection({}: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState(initFilter);

  useEffect(() => {
    axios.post(`/api/orders/?type=filter`, filter).then(({ data }) => {
      if (data.success) {
        setOrders(data.orders);
      } else {
        throw new Error(data.message);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios.post(`/api/orders/?type=filter`, filter).then(({ data }) => {
      if (data.success) {
        setOrders(data.orders);
      } else {
        throw new Error(data.message);
      }
    }).catch(({response}) => {
      throw new Error(response.data.message);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onFilterChange = ({
    status,
    month,
    year,
    sort,
    query,
  }: FilterChangeOptions) => {
    const newFilter = { ...filter };

    if (status) {
      newFilter.status = status;
    }

    if (month) {
      newFilter.month = month;
      newFilter.year = null;
    }

    if (year) {
      newFilter.year = year;
      newFilter.month = null;
    }

    if (sort) {
      newFilter.sort = sort;
    }

    if (query || query === "") {
      newFilter.query = query;
    }

    setFilter(newFilter);
  };

  const onStatusChange = (id: string, status: StatusValue) => {
    axios
      .post(`/api/orders/?type=status&id=${id}&status=${status}`)
      .then(({ data }) => {
        if (data.success) {
          const updatedOrder = data.orders[0];

          setOrders(
            orders.map((order) => {
              if (order.id === updatedOrder.id) {
                return updatedOrder;
              }
              return order;
            })
          );
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const onOrderDelete = (id: string) => {
    axios.post(`/api/orders/?type=delete&id=${id}`).then(({ data }) => {
      if (data.success) {
        setOrders(orders.filter((order) => order.id !== id));
      } else {
        throw new Error(data.message);
      }
    });
  };

  return (
    <section className={styles.wrapper}>
      {filter && (
        <OrderControl
          onFilterChange={onFilterChange}
          monthItems={MONTH_ITEMS}
          yearItems={YEAR_ITEMS}
        />
      )}
      <OrderList
        orders={orders}
        onStatusChange={onStatusChange}
        onOrderDelete={onOrderDelete}
      />
    </section>
  );
}

OrderManagementSection.displayName = "OrderManagementSection";

// get month items from now back to 12 months ago in  format "MM/YYYY"
const getMonthItems = () => {
  const monthItems = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  for (let i = 0; i < 12; i++) {
    const curMonth = month > i ? month - i : month - i + 12;
    const curYear = month > i ? year : year - 1;

    const monthItem = {
      label: `${curMonth}/${curYear}`,
      value: `${curMonth}/${curYear}`,
    };
    monthItems.push(monthItem);
  }
  return monthItems;
};

const monthItems = getMonthItems();
