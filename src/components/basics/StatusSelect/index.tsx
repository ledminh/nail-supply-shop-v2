import { FC } from "react";



import styles from "@styles/basics/StatusSelectCPN.module.scss";
import Select from "@/components/generics/Select";

import { orderStatus } from "@/config";

import { useState, useEffect } from "react";
import { StatusValue } from "@/types/order";


export interface Props  {
    onSave: (status: StatusValue) => void;
};

type StatusSelect = FC<Props>;

type StatusItem = {
    value: StatusValue;
    label: string;
}

const StatusSelectCPN:StatusSelect = ({onSave}) => {
    const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
    const [currentStatus, setCurrentStatus] = useState<StatusItem|null>(null);
    const [tempStatus, setTempStatus] = useState(statusItems[0]);

    const [showSelect, setShowSelect] = useState(false);

    useEffect(() => {
        const statusItems = Object.entries(orderStatus).map(([key, value]) => {
            const _value = value as StatusValue;
        
            return {
                value: _value,
                label: key,
            };
        });
        
        setStatusItems(statusItems);
        setCurrentStatus(statusItems[0]);
    }, []);

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
                    onSave(tempStatus.value);
                    setCurrentStatus(tempStatus);
                    setShowSelect(false);
                }}
            >
                Save
            </button>
            <button className={styles.cancel}
                onClick={() => {
                    setShowSelect(false);
                    setTempStatus(currentStatus!);
                }}
            >
                Cancel
            </button>
        </div>
    );
    
    const DisplayCPN = (
        <div className={styles.displayBlock}>
            <div className={styles.value}>
                {currentStatus!.label}
            </div>
            <button className={styles.changeButton}
                onClick={() => {
                    setTempStatus(currentStatus!);
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
