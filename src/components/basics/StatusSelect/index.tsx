import { FC } from "react";

import styles from "@styles/basics/StatusSelectCPN.module.scss";
import Select from "@/components/generics/Select";

import { orderStatus } from "@/config";

import { useState, useEffect } from "react";
import { StatusValue } from "@/types/order";

export interface Props {
  onSave: (status: StatusValue) => void;
  initStatusValue: StatusValue;
}

type StatusSelect = FC<Props>;

type StatusItem = {
  value: StatusValue;
  label: StatusValue;
};

const StatusSelectCPN: StatusSelect = ({ onSave, initStatusValue }) => {
  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
  const [currentStatus, setCurrentStatus] = useState<StatusItem | null>(null);
  const [tempStatus, setTempStatus] = useState<StatusItem | null>(null);

  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    const statusItems = Object.entries(orderStatus).map(([key, value]) => {
      const _key = key as StatusValue;

      return {
        value: _key,
        label: _key,
      };
    });

    const initStatusItem = statusItems.find(
      (item) => item.value === initStatusValue
    ) as StatusItem;

    setCurrentStatus(initStatusItem);
    setTempStatus(initStatusItem);

    setStatusItems(statusItems);
  }, []);

  const SelectCPN =
    statusItems.length > 0 && tempStatus && currentStatus ? (
      <div className={styles.selectBlock}>
        <Select
          selectClass={styles.select}
          optionClass={styles.option}
          optionItems={statusItems}
          initOptionItem={tempStatus}
          onChange={setTempStatus}
        />
        <button
          className={styles.save}
          onClick={() => {
            onSave(tempStatus.value);
            setCurrentStatus(tempStatus);
            setShowSelect(false);
          }}
        >
          Save
        </button>
        <button
          className={styles.cancel}
          onClick={() => {
            setShowSelect(false);
            setTempStatus(currentStatus);
          }}
        >
          Cancel
        </button>
      </div>
    ) : null;

  const DisplayCPN = currentStatus ? (
    <div className={styles.displayBlock}>
      <div className={styles.value}>{currentStatus.label}</div>
      <button
        className={styles.changeButton}
        onClick={() => {
          setTempStatus(currentStatus);
          setShowSelect(true);
        }}
      >
        Change
      </button>
    </div>
  ) : null;

  return (
    <div className={styles.wrapper}>{showSelect ? SelectCPN : DisplayCPN}</div>
  );
};

export default StatusSelectCPN;

StatusSelectCPN.displayName = "StatusSelectCPN";
