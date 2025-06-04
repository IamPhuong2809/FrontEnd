import { useState, useRef } from 'react';

/**
 * @param {number} initialValue - Giá trị khởi tạo (mặc định 5).
 * @param {number} min - Giá trị tối thiểu (mặc định 0).
 * @param {number} max - Giá trị tối đa (mặc định 100).
 * @param {number} step - Bước nhảy khi tăng/giảm (mặc định 1).
 * @param {number} intervalDelay - Thời gian interval (mặc định 150ms).
 * @returns {object} - Trả về các hàm và giá trị: value, setValue, changeValue, handleMouseDown, handleMouseUp.
 */
export const useCounter = (initialValue = 0, step = 1, intervalDelay = 150) => {
  const [value, setValue] = useState(initialValue);
  const intervalRef = useRef(null);
  const lastClickTimeRef = useRef(0); 

  // Hàm thay đổi giá trị theo kiểu "increase" hoặc "decrease"
  const setCurrentValue = (value) =>{
    setValue(value);
  }
  const changeValue = (type, limit) => {
    const [min, max] = limit;
    setValue((prevValue) => {
      const newValue = type === "increase" ? prevValue + step : prevValue - step;
      if(min > 0){
        if(prevValue === min*0.2 && type === "increase")
          return min;
        if(newValue === 0 || (prevValue === min*0.2 && type !== "increase"))
          return min*0.2;
      }
      return Math.max(min, Math.min(max, newValue));
    });
  };

  const handleMouseDown = (type, limit) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    changeValue(type, limit);
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    if (timeSinceLastClick < 300) {
      return;
    }
    lastClickTimeRef.current = now;

    intervalRef.current = setInterval(() => {
      changeValue(type, limit);
    }, intervalDelay);
  };

  const handleMouseUp = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return { value, handleMouseDown, handleMouseUp, setCurrentValue };
};
