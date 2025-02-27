import React, { useState, useEffect } from 'react'
import './Input.css'
const Input = ({ title, value, maxLength, width, unit, left, onChange }) => {

    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value); // Cập nhật khi prop value thay đổi
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue); // Gọi hàm onChange khi giá trị thay đổi
    };

  return (
    <div className="input-group">
        <label>{title}</label>
        <div className="input-group-container">
            <input
                type="text" maxLength={maxLength}
                value={inputValue}
                style={{ width: width }}
                onChange={handleChange}
            />
            <span className="unit" style={{ left: left }}>{unit}</span>
        </div>
    </div>
  )
}

export default Input