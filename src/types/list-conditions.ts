type SortType = 'name' | 'price';
type SortLabel = 'Name' | 'Price';

type SortedOrderType = 'asc' | 'desc'; 
type SortedOrderLabel = 'Ascending' | 'Descending';

export type SortItem = {
    label: SortLabel;
    value: SortType;
}

export type SortedOrderItem = {
    label: SortedOrderLabel;
    value: SortedOrderType;
}

export type SelectOptionItem = SortItem | SortedOrderItem;

export type ListCondition = {
    sort?: SortItem;
    sortedOrder?: SortedOrderItem
}