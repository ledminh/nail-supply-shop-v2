import Select from "@/components/generics/Select";
import styles from "@styles/composites/OrderControl.module.scss";
import SearchBarCPN from "../SearchBar";
import { orderStatus } from "@/config";

import { StatusValue } from "@/types/order";

import { useState, useEffect } from "react";

export interface Props {
    onChange: (options: {
        status: StatusValue;
        month: string;
        year: string;
        sort: string;
        query: string;
    }) => void;
}

type StatusItem = {
    value: StatusValue;
    label: string;
}


export default function OrderControl({ onChange }: Props) {

    const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
    const [curStatus, setCurStatus] = useState<StatusItem|null>(null);
    const [curMonthYear, setCurMonthYear] = useState(monthYearItems[0]);
    const [curMonth, setCurMonth] = useState(monthItems[0]);
    const [curYear, setCurYear] = useState(yearItems[0]);
    const [curSort, setCurSort] = useState(sortItems[0]);
    const [curQuery, setCurQuery] = useState('');

    useEffect(() => {
        const statusItems = Object.entries(orderStatus).map(([key, value]) => {
            const _value = value as StatusValue;
        
            return {
                value: _value,
                label: key,
            };
        });
        
        setStatusItems(statusItems);
        setCurStatus(statusItems[0]);
    }, []);

    useEffect(() => {
        onChange({
            status: curStatus!.value,
            month: curMonth.value,
            year: curYear.value,
            sort: curSort.value,
            query: curQuery,
        });
    }, [curStatus, curMonth, curYear, curSort, curQuery]);

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
                    initOptionItem = {curStatus!}
                    onChange = {(status) => setCurStatus(status)}
                    />
                <Select
                    selectClass = {styles.selectMonthYear}
                    optionClass = {styles.optionMonthYear}
                    optionItems = {monthYearItems}
                    initOptionItem = {curMonthYear}
                    onChange = {(monthYear) => setCurMonthYear(monthYear)}
                    />
                {
                    curMonthYear.value === 'month' && (
                        <Select
                            selectClass = {styles.selectMonth}
                            optionClass = {styles.optionMonth}
                            optionItems = {monthItems}
                            initOptionItem = {curMonth}
                            onChange = {(month) => setCurMonth(month)}
                            />
                    )
                }
                {
                    curMonthYear.value === 'year' && (
                        <Select
                            selectClass = {styles.selectYear}
                            optionClass = {styles.optionYear}
                            optionItems = {yearItems}
                            initOptionItem = {curYear}
                            onChange = {(year) => setCurYear(year)}
                            />
                    )
                }
            </section>
            <section className={styles.searchBar}>
                <SearchBarCPN
                    onSearchSubmit = {(query) => setCurQuery(query)}
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
                    onChange = {(sort) => setCurSort(sort)}
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


const monthItems = getMonthItems();


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

const yearItems = getYearItems();

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