import { useState } from 'react';

/**
 * @param {number} initialValue - Giá trị khởi tạo (mặc định 0).
 * @param {number} step - Bước nhảy khi tăng/giảm (mặc định 1).
 * @returns {object} - Trả về: value, setCurrentValue, increase, decrease
 */
export const useCounter = (initialValue = 0, step = 1, minmax = [-Infinity, Infinity]) => {
  const [min, max] = minmax;
  const [value, setValue] = useState(initialValue);

  const setCurrentValue = (val) => {
    setValue(val);
  };

  const increase = () => {
    setValue((prev) => {
      const newValue = Math.min(max, prev + step);
      return parseFloat(newValue.toFixed(2));
    });
  };

  const decrease = () => {
    setValue((prev) => {
      let newValue = Math.max(min, prev - step);
      // Nếu có min > 0 logic đặc biệt
      if (min > 0 && newValue === min) {
        if (prev === min * 0.2) return min;
        if (prev !== min) return min * 0.2;
      }
      return parseFloat(newValue.toFixed(2));
    });
  };

  return { value, setCurrentValue, increase, decrease };
};
