import React, { FC, useState, useEffect } from "react";
import styles from "@styles/generics/Select.module.scss";

export type OptionItem<T> = T & {
  value: string;
  label: string;
};

interface Props<T> {
    selectClass?: string;
    optionClass?: string;
    optionItems: OptionItem<T>[];
    initOptionItem?: OptionItem<T>;
    onChange: (selectedOption: OptionItem<T>) => void;
}

function Select<T>  ({
    selectClass,
    optionClass,
    optionItems,
    initOptionItem,
    onChange,
}:Props<T>)  {
    const [selectedOption, setSelectedOption] = useState(
        optionItems.find(
        (optionItem) => optionItem.value === initOptionItem?.value
        ) || optionItems[0]
    );

    useEffect(() => {
        onChange(selectedOption);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption]);

    const selectClasses = [styles.wrapper, selectClass].join(" ");
    const optionClasses = [styles.option, optionClass].join(" ");

    const _onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = optionItems.find(
        (optionItem) => optionItem.value === e.target.value
        );
        if (selectedOption) {
        setSelectedOption(selectedOption);
        }
    };

    return (
        <select className={selectClasses} value={selectedOption.value} onChange={_onChange}>
        {optionItems.map((optionItem) => (
            <option key={optionItem.value} className={optionClasses} value={optionItem.value}>
            {optionItem.label}
            </option>
        ))}
        </select>
    );
};

Select.displayName = "SelectCPN";

export default Select;