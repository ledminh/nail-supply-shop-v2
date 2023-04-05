import React, { FC, useState, useEffect } from "react";
import styles from "@styles/generics/Select.module.scss";

export type OptionItem<T = any> = T & {
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

const HeadOption:OptionItem = {
    value: "head",
    label: "Select an option"
};

function Select<T>  ({
    selectClass,
    optionClass,
    optionItems,
    initOptionItem,
    onChange,
}:Props<T>)  {
    const _initOptionItem = initOptionItem || HeadOption;

    const [selectedOption, setSelectedOption] = useState(_initOptionItem);


    const selectClasses = [styles.wrapper, selectClass].join(" ");
    const optionClasses = [styles.option, optionClass].join(" ");

    const _onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = optionItems.find(
        (optionItem) => optionItem.value === e.target.value
        );
        if (selectedOption) {
        setSelectedOption(selectedOption);
        onChange(selectedOption);
        }
    };

    return (
        <select className={selectClasses} 
                value={selectedOption.value} 
                onChange={_onChange}
                onClick={(e) => e.preventDefault()}
                >
                {
                    !initOptionItem && (
                        <option
                            key={HeadOption.value}
                            className={optionClasses}
                            value={HeadOption.value}
                            onClick={(e) => e.preventDefault()}
                        >
                            {HeadOption.label}
                        </option>
                    )
                }
        {optionItems.map((optionItem) => (
            <option 
                key={optionItem.value} 
                className={optionClasses} 
                value={optionItem.value}
                onClick={(e) => e.preventDefault()}>
                {optionItem.label}
            </option>
        ))}
        </select>
    );
};

Select.displayName = "SelectCPN";

export default Select;


type convertProps<T> = {
    item: T;
    getValue: (item: T) => string;
    getLabel: (item: T) => string;
};

export function convertToOptionItem<T> ({item, getValue, getLabel}:convertProps<T>): OptionItem<T>  {
    return {
        value: getValue(item),
        label: getLabel(item),
        ...item,
    };
}
