import { FC } from "react";
import { useState, useEffect } from "react";

import styles from "@styles/basics/QuantityPickerCPN.module.scss";

export interface Props {
  value: number;
  onChange?: (value: number) => void;
  buttonClassName?: string;
  valueClassName?: string;
  className?: string;
  min?: number;
  max?: number;
}

type QuantityPicker = FC<Props>;

const QuantityPickerCPN: QuantityPicker = ({
  value = 0,
  onChange,
  buttonClassName,
  valueClassName,
  className,
  min,
  max,
}) => {
  const [_value, _setValue] = useState(value);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  const increment = () => {
    const _max = max || Number.MAX_SAFE_INTEGER;

    if (_value < _max) {
      _setValue(_value + 1);
    }

    if (onChange) {
      onChange(_value + 1);
    }
  };

  const decrement = () => {
    const _min = min || 0;
    if (_value > _min) {
      _setValue(_value - 1);

      if (onChange) {
        onChange(_value - 1);
      }
    }
  };

  const classNames = [styles.wrapper, className].join(" ");
  const buttonClassNames = [styles.button, buttonClassName].join(" ");
  const valueClassNames = [styles.value, valueClassName].join(" ");

  return (
    <div className={classNames}>
      <button
        className={buttonClassNames}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          decrement();
        }}
      >
        -
      </button>
      <span className={valueClassNames}>{_value}</span>
      <button
        className={buttonClassNames}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          increment();
        }}
      >
        +
      </button>
    </div>
  );
};

export default QuantityPickerCPN;

QuantityPickerCPN.displayName = "QuantityPickerCPN";
