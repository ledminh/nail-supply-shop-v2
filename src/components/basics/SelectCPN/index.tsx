import { FC } from "react";



import styles from "@styles/basics/SelectCPN.module.scss";
import type { SelectOptionItem } from "@/types/list-conditions";

import { useState, useEffect } from "react";


export interface Props  {
    selectClass?: string;
    optionClass?: string;

    optionItems: SelectOptionItem[];
    initOptionItem?: SelectOptionItem;
    onChange: (selectedOption: SelectOptionItem) => void;
};

type SelectCPN = FC<Props>;


const SelectCPN:SelectCPN = ({selectClass, optionClass, optionItems, initOptionItem, onChange}) => {

    const [selectedOption, setSelectedOption] = useState(optionItems.find((optionItem) => optionItem.value === initOptionItem?.value) || optionItems[0]);


  

    useEffect(() => {
        onChange(selectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption]);

    

    const selectClasses = [styles.wrapper, selectClass].join(' ');
    const optionClasses = [styles.option, optionClass].join(' ');

    const _onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = optionItems.find((optionItem) => optionItem.value === e.target.value);
        if (selectedOption) {
            setSelectedOption(selectedOption);
        }
    };



    return (
        <select className={selectClasses}
            value={selectedOption.value}
            onChange={_onChange}
        >
            {optionItems.map((optionItem) => {
                return (
                    <option key={optionItem.value} className={optionClasses} value={optionItem.value}>
                        {optionItem.label}
                    </option>
                );
            })}
        </select>
    );
}

export default SelectCPN;

SelectCPN.displayName = "SelectCPN";