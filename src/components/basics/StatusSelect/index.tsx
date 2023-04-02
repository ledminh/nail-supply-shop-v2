import { FC } from "react";



import styles from "@styles/basics/StatusSelectCPN.module.scss";
import Select from "@/components/generics/Select";

import { orderStatus } from "@/config";

import { useState } from "react";
import { StatusValue } from "@/types/order";


export interface Props  {
    onSave: (status: StatusValue) => void;
};

type StatusSelect = FC<Props>;


const StatusSelectCPN:StatusSelect = ({onSave}) => {
    const [currentStatus, setCurrentStatus] = useState(statusItems[0]);
    const [tempStatus, setTempStatus] = useState(statusItems[0]);

    const [showSelect, setShowSelect] = useState(false);

    const SelectCPN = (
        <div className={styles.selectBlock}>
            <Select
                selectClass = {styles.select}
                optionClass = {styles.option}
                optionItems = {statusItems}
                initOptionItem = {tempStatus}
                onChange = {setTempStatus}
            />
            <button className={styles.save}
                onClick={() => {
                    onSave(tempStatus.label);
                    setCurrentStatus(tempStatus);
                    setShowSelect(false);
                }}
            >
                Save
            </button>
            <button className={styles.cancel}
                onClick={() => {
                    setShowSelect(false);
                    setTempStatus(currentStatus);
                }}
            >
                Cancel
            </button>
        </div>
    );
    
    const DisplayCPN = (
        <div className={styles.displayBlock}>
            <div className={styles.value}>
                {currentStatus.label}
            </div>
            <button className={styles.changeButton}
                onClick={() => {
                    setTempStatus(currentStatus);
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
    label: key as StatusValue,
}));