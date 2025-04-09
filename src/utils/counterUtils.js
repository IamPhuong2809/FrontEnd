import { useState, useRef } from 'react';

/**
 * @param {number} initialValue - Giá trị khởi tạo (mặc định 5).
 * @param {number} min - Giá trị tối thiểu (mặc định 0).
 * @param {number} max - Giá trị tối đa (mặc định 100).
 * @param {number} step - Bước nhảy khi tăng/giảm (mặc định 1).
 * @param {number} intervalDelay - Thời gian interval (mặc định 150ms).
 * @returns {object} - Trả về các hàm và giá trị: value, setValue, changeValue, handleMouseDown, handleMouseUp.
 */
export const useCounter = (initialValue = 0, limit, step = 1, intervalDelay = 150) => {
  const [value, setValue] = useState(initialValue);
  const intervalRef = useRef(null);
  const [min, max] = limit;

  // Hàm thay đổi giá trị theo kiểu "increase" hoặc "decrease"
  const changeValue = (type) => {
    setValue((prevValue) => {
      const newValue = type === "increase" ? prevValue + step : prevValue - step;
      return Math.max(min, Math.min(max, newValue));
    });
  };

  const handleMouseDown = (type) => {
    changeValue(type);
    intervalRef.current = setInterval(() => {
      changeValue(type);
    }, intervalDelay);
  };

  const handleMouseUp = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return { value, handleMouseDown, handleMouseUp };
};
