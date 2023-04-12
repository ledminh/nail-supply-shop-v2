export type SortType = "name" | "price" | "dateCreated" | "sellCount" | 'lastUpdated';
type SortLabel = "Name" | "Price" | "Date Created" | "Sell Count" | 'Last Updated';

export type SortedOrderType = "asc" | "desc";
type SortedOrderLabel = "Ascending" | "Descending";

export type SortItem = {
  label: SortLabel;
  value: SortType;
};

export type SortedOrderItem = {
  label: SortedOrderLabel;
  value: SortedOrderType;
};

export type ListCondition = {
  sort?: SortItem;
  sortedOrder?: SortedOrderItem;
};
