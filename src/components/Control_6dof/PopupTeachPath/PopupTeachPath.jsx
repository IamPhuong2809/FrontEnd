import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './PopupTeachPath.css';
const url = "http://127.0.0.1:8000/api/"

const PopupTeachPath = (props) => {
    const {
        selectedPoint,
        selectedPath,
        coordinateRows,
        handleDetailClose,
    } = props;

    // Khai báo mảng cấu hình các ô cần hiển thị
    const parameterConfig = [
        {
        label: 'Motion Typ',
        type: 'select',
        options: ['LIN', 'PTP', 'CIRC'],   // 3 item cho dropdown
        defaultValue: 'LIN'
        },
        {
        label: 'CONT',
        type: 'select',
        options: ['FALSE', 'TRUE', 'MIX'], // 3 item cho dropdown
        defaultValue: 'FALSE'
        },
        {
        label: 'Stop Point',
        type: 'select',
        options: ['NO', 'YES', 'MAYBE'],   // 3 item cho dropdown
        defaultValue: 'NO'
        },
        {
        label: 'Velocity',
        type: 'text',
        defaultValue: '10'
        },
        {
        label: 'Acceleration',
        type: 'text',
        defaultValue: '10'
        },
        {
        label: 'Corner distance',
        type: 'text',
        defaultValue: '100'
        }
    ];

    const [parameterValues, setParameterValues] = useState(
        parameterConfig.map(param => param.defaultValue)
        );


    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const response = await fetch(url + "O0016/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: parameterValues,
                    idPath: selectedPath.id,
                    idPoint: selectedPoint.id
                }),
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className='point-detail-teachpath'>
            <div className="point-detail-header">
                <div className="point-detail-title">
                [Point {selectedPoint.id}] "{selectedPoint.name}"
                </div>
                <button className="close-button" onClick={handleDetailClose}>
                ✕
                </button>
            </div>

            <div className="coordinates-container">
                {coordinateRows.map((row, rowIndex) => (
                <div className="coordinates-row" key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                    <div className="coordinates-cell" key={cellIndex}>
                        <div className="coordinate-label">{cell.label}</div>
                        <div className="coordinate-value-main">{cell.main}</div>
                    </div>
                    ))}
                </div>
                ))}
            </div>

            <div className="parameter-form-container">
                {parameterConfig.map((param, index) => (
                <div className="parameter-item" key={index}>
                    <label className="parameter-label">{param.label}</label>
                    {param.type === 'select' ? (
                    <select
                        className="parameter-select"
                        value={parameterValues[index]}
                        onChange={(e) => {
                        const newValues = [...parameterValues];
                        newValues[index] = e.target.value;
                        setParameterValues(newValues);
                        }}
                    >
                        {param.options.map((option, idx) => (
                        <option key={idx} value={option}>
                            {option}
                        </option>
                        ))}
                    </select>
                    ) : (
                    <div className="parameter-input-wrapper">
                        <input
                        type="number"
                        value={parameterValues[index]}
                        onChange={(e) => {
                            const newValues = [...parameterValues];
                            newValues[index] = e.target.value;
                            setParameterValues(newValues);
                        }}
                        />
                        <span className="unit-label">
                        {param.label === 'Velocity' || param.label === 'Acceleration'
                            ? '%'
                            : param.label === 'Corner distance'
                            ? 'mm'
                            : ''}
                        </span>
                    </div>
                    )}
                </div>
                ))}
            </div>

            <div className="button-container">
                <button
                    className="button-save"
                    onClick={() => {
                        handleSave();
                        console.log('🟢 Sending values:', parameterValues);
                    }}
                >
                    Save
                </button>
                <button 
                    className="button-item"
                    onClick={() => {
                        navigate('/6dof/Move',{
                            state: {position: coordinateRows}
                        });
                    }}
                >
                    Jog
                </button>
            </div>

            <h1>
                Note: If you want to change position, parameter. You can go JOG and
                change then save again
            </h1>
        </div>
    );
};

export default PopupTeachPath;
