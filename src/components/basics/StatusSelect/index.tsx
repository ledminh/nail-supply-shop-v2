import { FC } from "react";



import styles from "@styles/basics/StatusSelectCPN.module.scss";
import Select from "@/components/generics/Select";

import { orderStatus } from "@/config";

import { useState } from "react";


export interface Props  {

};

type StatusSelect = FC<Props>;


const StatusSelectCPN:StatusSelect = ({}) => {
    const [currentStatus, setCurrentStatus] = useState(statusItems[0]);
    const [showSelect, setShowSelect] = useState(false);

    const SelectCPN = (
        <div className={styles.select}>
            <Select
                selectClass = {styles.select}
                optionClass = {styles.option}
                optionItems = {statusItems}
                initOptionItem = {currentStatus}
                onChange = {setCurrentStatus}
            />
            <button className={styles.saveButton}
                onClick={() => {
                    setShowSelect(false)
                }}
            >
                Save
            </button>
            <button className={styles.cancelButton}
                onClick={() => {
                    setShowSelect(false)
                }}
            >
                Cancel
            </button>
        </div>
    );
    
    const DisplayCPN = (
        <div className={styles.display}>
            <div className={styles.value}>
                {currentStatus.label}
            </div>
            <button className={styles.changeButton}
                onClick={() => {
                    setShowSelect(true)
                }}
            >
                Change
            </button>
        </div>
    );

    return (
        <div className={styles.wrapper}>
            {
                showSelect ? SelectCPN : DisplayCPN
            }
        </div>
    );
}

export default StatusSelectCPN;

StatusSelectCPN.displayName = "StatusSelectCPN";

const statusItems = Object.entries(orderStatus).map(([key, value]) => ({
    value: value,
    label: key,
}));