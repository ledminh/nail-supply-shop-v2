import { FilterOrder, StatusValue } from "@/types/order";

// month or year
type MonthOrYearItem = {
    label: 'month',
    value: 'month'
} | {
    label: 'year',
    value: 'year'
};

export const MONTH: MonthOrYearItem = {
    label: 'month',
    value: 'month'
};

export const YEAR: MonthOrYearItem = {
    label: 'year',
    value: 'year'
};


export type FilterChangeOptions = Partial<FilterOrder>;

export type StatusItem = {
    label: StatusValue | 'all',
    value: StatusValue | 'all'
}


export const STATUS_ITEMS: StatusItem[] = [
    {
        label: 'all',
        value: 'all'
    },
    {
        label: 'processing',
        value: 'processing'
    },
    {
        label: 'shipped',
        value: 'shipped'
    },
    {
        label: 'delivered',
        value: 'delivered'
    }
];



// sort items "Newest to Oldest" and "Oldest to Newest"
type SortItem = {
    label: 'Newest to Oldest',
    value: 'newest'
} | {
    label: 'Oldest to Newest',
    value: 'oldest'
};

export const NEWEST: SortItem = {
    label: 'Newest to Oldest',
    value: 'newest'
};

export const OLDEST: SortItem = {
    label: 'Oldest to Newest',
    value: 'oldest'
};