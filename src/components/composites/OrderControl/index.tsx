import Select from "@/components/generics/Select";
import styles from "@styles/composites/OrderControl.module.scss";
import SearchBarCPN from "../SearchBar";

import { OptionItem } from "@/components/generics/Select";

import { useEffect, useState } from "react";

import {
  MONTH,
  YEAR,
  FilterChangeOptions,
  NEWEST,
  OLDEST,
  STATUS_ITEMS,
} from "./type";

export interface Props {
  monthItems: OptionItem;
  yearItems: OptionItem;
  onFilterChange: (option: FilterChangeOptions) => void;
}

export default function OrderControl({
  monthItems,
  yearItems,
  onFilterChange,
}: Props) {
  const [monthOrYear, setMonthOrYear] = useState(MONTH);

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (monthOrYear === MONTH) {
      onFilterChange({ month: monthItems[0].value });
    } else {
      onFilterChange({ year: yearItems[0].value });
    }
  }, [monthOrYear]);

  return (
    <section className={styles.wrapper}>
      <section className={styles.filters}>
        <span className={styles.label}>Filters</span>
        <Select
          selectClass={styles.selectStatus}
          optionClass={styles.optionStatus}
          optionItems={STATUS_ITEMS}
          initOptionItem={STATUS_ITEMS[0]}
          onChange={(item) => onFilterChange({ status: item.value })}
        />
        <Select
          selectClass={styles.selectMonthYear}
          optionClass={styles.optionMonthYear}
          optionItems={[MONTH, YEAR]}
          initOptionItem={MONTH}
          onChange={(item) => setMonthOrYear(item)}
        />
        {monthOrYear === MONTH && (
          <Select
            selectClass={styles.selectMonth}
            optionClass={styles.optionMonth}
            optionItems={monthItems}
            initOptionItem={monthItems[0]}
            onChange={(item) => onFilterChange({ month: item.value })}
          />
        )}
        {monthOrYear === YEAR && (
          <Select
            selectClass={styles.selectYear}
            optionClass={styles.optionYear}
            optionItems={yearItems}
            initOptionItem={yearItems[0]}
            onChange={(item) => onFilterChange({ year: item.value })}
          />
        )}
      </section>
      <section className={styles.searchBar}>
        <SearchBarCPN
          onSearchSubmit={(query) => {
            onFilterChange({ query });
            setQuery(query);
          }}
          placeholder="Order number ..."
        />
        {query && (
          <div className={styles.currentQuery}>
            <span className={styles.label}>Current query:</span>
            <span className={styles.query}>{query}</span>
            <button
              className={styles.clear}
              onClick={() => {
                onFilterChange({ query: "" });
                setQuery("");
              }}
            >
              CLEAR
            </button>
          </div>
        )}
      </section>
      <section className={styles.sort}>
        <span className={styles.label}>Sort</span>
        <Select
          selectClass={styles.selectSort}
          optionClass={styles.optionSort}
          optionItems={[NEWEST, OLDEST]}
          initOptionItem={NEWEST}
          onChange={(item) => onFilterChange({ sort: item.value })}
        />
      </section>
    </section>
  );
}

OrderControl.displayName = "OrderControl";
