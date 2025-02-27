import React, { useEffect, useState } from 'react'
import './Input.css'
const Input = (props) => {

    const{
        title,
        formValue,
        maxLength,
        width,
        unit,
        left,
        onChange
    } = props;

    useEffect(() => {
        setInputValue(formValue);
    }, [formValue]);

    const [inputValue, setInputValue] = useState(formValue);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        onChange(inputValue); // Gọi hàm onChange khi giá trị thay đổi
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