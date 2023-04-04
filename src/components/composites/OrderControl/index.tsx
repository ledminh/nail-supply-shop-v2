import Select from "@/components/generics/Select";
import styles from "@styles/composites/OrderControl.module.scss";
import SearchBarCPN from "../SearchBar";

import { FilterOrder, StatusValue } from "@/types/order";

import { orderStatus } from "@/config";

import { useState, useEffect } from "react";

export interface Props {
    onChange: (filter:FilterOrder) => void;
    initFilter: FilterOrder;
}

type StatusItem = {
    value: StatusValue | 'all';
    label: StatusValue | 'all';
};

type Item = {
    value: string;
    label: string;
}

export default function OrderControl({ onChange, initFilter }: Props) {

    const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
    const [filter, setFilter] = useState<FilterOrder>(initFilter);
    const [curMonthYear, setCurMonthYear] = useState(monthYearItems[0]);

    const [monthItems, setMonthItems] = useState<Item[]>([]);
    const [yearItems, setYearItems] = useState<Item[]>([]);



    const [curStatus, setCurStatus] = useState<StatusItem|null>(null);
    const [curMonth, setCurMonth] = useState<Item|null>(null);
    const [curYear, setCurYear] = useState<Item|null>(null);
    const [curSort, setCurSort] = useState<Item|null>(null);
    const [curQuery, setCurQuery] = useState("");


        
    useEffect(() => {
        const statusItems = [{
            value: 'all',
            label: 'all',
        },
            ...Object.entries(orderStatus).map(([key, value]) => {
            return {
                value: key as StatusValue,
                label: key as StatusValue,
            };
        })] as StatusItem[];

        const monthItems = getMonthItems();
        const yearItems = getYearItems();

        setStatusItems(statusItems);
        setMonthItems(monthItems);
        setYearItems(yearItems);

        const curStatus = statusItems.find((item) => item.value === filter.status) || statusItems[0];
        setCurStatus(curStatus);

        const curSort = sortItems.find((item) => item.value === filter.sort) || sortItems[0];
        setCurSort(curSort);

        if(curMonthYear.value === 'month') {
            const curMonth = monthItems.find((item) => item.value === filter.month) || monthItems[0];
            setCurMonth(curMonth);
            setCurYear(null);
        }
        else {
            const curYear = yearItems.find((item) => item.value === filter.year) || yearItems[0];
            setCurYear(curYear);
            setCurMonth(null);
        }
    }, []);   
    
    
    
    useEffect(() => {
        onChange(filter);
    }, [filter]);

    const onStatusChange = (status: StatusItem) => {
        setCurStatus(status);

        setFilter({
            ...filter,
            status: status.value,
        });
    }

    const onMonthYearChange = (monthYear: Item) => {
        setCurMonthYear(monthYear);

        if(monthYear.value === 'month') {
            setCurMonth(monthItems[0]);
            setCurYear(null);
        }
        else {
            setCurYear(yearItems[0]);
            setCurMonth(null);
        }

        setFilter({
            ...filter,
            month: monthYear.value === 'month' ? monthItems[0].value : null,
            year: monthYear.value === 'year' ? yearItems[0].value : null,
        });
    }

    const onMonthChange = (month: Item) => {
        setCurMonth(month);

        setFilter({
            ...filter,
            month: month.value,
        });
    }

    const onYearChange = (year: Item) => {
        setCurYear(year);

        setFilter({
            ...filter,
            year: year.value,
        });
    }

    const onSortChange = (sort: Item) => {
        setCurSort(sort);
    
        setFilter({
            ...filter,
            sort: sort.value,
        });
    }

    const onQueryChange = (query: string) => {
        setCurQuery(query);

        setFilter({
            ...filter,
            query,
        });

    }


    if(!curStatus || !curMonthYear || !curSort) return null;


    return (
        <section className={styles.wrapper}>
            <section className={styles.filters}>
                <span className={styles.label}>
                    Filters
                </span>
                <Select
                    selectClass = {styles.selectStatus}
                    optionClass = {styles.optionStatus}
                    optionItems = {statusItems}
                    initOptionItem = {curStatus}
                    onChange = {onStatusChange}
                    />
                <Select
                    selectClass = {styles.selectMonthYear}
                    optionClass = {styles.optionMonthYear}
                    optionItems = {monthYearItems}
                    initOptionItem = {curMonthYear}
                    onChange = {onMonthYearChange}
                    />
                {
                    curMonthYear.value === 'month' && curMonth &&(
                        <Select
                            selectClass = {styles.selectMonth}
                            optionClass = {styles.optionMonth}
                            optionItems = {monthItems}
                            initOptionItem = {curMonth}
                            onChange = {onMonthChange}
                            />
                    )
                }
                {
                    curMonthYear.value === 'year' && curYear && (
                        <Select
                            selectClass = {styles.selectYear}
                            optionClass = {styles.optionYear}
                            optionItems = {yearItems}
                            initOptionItem = {curYear}
                            onChange = {onYearChange}
                            />
                    )
                }
            </section>
            <section className={styles.searchBar}>
                <SearchBarCPN
                    onSearchSubmit = {onQueryChange}
                    placeholder = "Order number ..."
                    />
            </section>
            <section className={styles.sort}>
                <span className={styles.label}>
                    Sort
                </span>
                <Select
                    selectClass = {styles.selectSort}
                    optionClass = {styles.optionSort}
                    optionItems = {sortItems}
                    initOptionItem = {curSort}
                    onChange = {onSortChange}
                    />
            </section> 
        </section>
    );
}

OrderControl.displayName = "OrderControl";


/***************************
 * Filter and Sort Options *
 */



    // month or year
const monthYearItems = [
    {
        label: "Month",
        value: "month"
    },
    {
        label: "Year",
        value: "year"
    }
];

// get month items from now back to 12 months ago in  format "MM/YYYY"
const getMonthItems = () => {
    const monthItems = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    for (let i = 0; i < 12; i++) {
        const curMonth  = month > i? month - i: month - i + 12;
        const curYear = month > i? year: year - 1;


        const monthItem = {
            label: `${curMonth}/${curYear}`,
            value: `${curMonth}/${curYear}`
        };
        monthItems.push(monthItem);
    }
    return monthItems;
};




// get year items from now back to 10 years ago in  format "YYYY"
const getYearItems = () => {
    const yearItems = [];
    const now = new Date();
    const year = now.getFullYear();
    for (let i = 0; i < 10; i++) {
        const yearItem = {
            label: `${year - i}`,
            value: `${year - i}`
        };
        yearItems.push(yearItem);
    }
    return yearItems;
};


// sort items "Newest to Oldest" and "Oldest to Newest"

const sortItems = [
    {
        label: "Newest to Oldest",
        value: "newest"
    },
    {
        label: "Oldest to Newest",
        value: "oldest"
    }
];