import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './PopupTeachPath.css';
import toast from 'react-hot-toast';
import { API_URL } from '@utils/config';

const PopupTeachPath = (props) => {
    const {
        selectedPoint,
        selectedPath,
        handleDetailClose,
    } = props;

    // Khai báo mảng cấu hình các ô cần hiển thị
    //#region data
    const parameterConfig = [
        {
        label: 'Motion Typ',
        type: 'select',
        options: ['LIN', 'PTP', 'CIRC'],   // 3 item cho dropdown
        defaultValue: 'LIN'
        },
        {
        label: 'EE',
        type: 'select',
        options: ['GRIP', 'RELEASE', 'SKIP'], // 3 item cho dropdown
        defaultValue: 'SKIP'
        },
        {
        label: 'Stop Point',
        type: 'select',
        options: ['FALSE', 'TRUE'],   // 3 item cho dropdown
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

    const coordinateRows = [
      [
        { label: 'X', main: '+0.00'},
        { label: 'Y', main: '-210.00'},
        { label: 'Z', main: '+495.00'}

      ],
      [
        { label: 'RX', main: '+180.00'},
        { label: 'RY', main: '+0.00'},
        { label: 'RZ', main: '+81.99'}
      ],
      [
          { label: 'Tool', main: '0'},
          { label: 'Figure', main: '+5'},
          { label: 'Work', main: '0'}
      ]
    ];

    const [parameterValues, setParameterValues] = useState(
        parameterConfig.map(param => param.defaultValue)
    );

    const [coordinateValues, setCoordinateValues] = useState(coordinateRows);

    const navigate = useNavigate();
    //#endregion

    const handleSave = async () => {
        try {
            const response = await fetch(API_URL + "O0016/", {
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
            const data = await response.json();
            if(data.success){
                toast.success("Successfully save data!", {
                    style: {border: '1px solid green'}});
            } else {
                toast.error("Failed to save: " + data.error, {
                    style: {border: '1px solid red'}});
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

      const fetchLoadData = async () => {
          try {
            const response = await fetch(API_URL + "point/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id_parent:selectedPath.id, id:selectedPoint.id, type:"data"})
            });
            const data = await response.json();
            const newParameterValues = parameterConfig.map(param => {
              switch (param.label) {
                  case 'Motion Typ':
                  return data[0].motion;
                  case 'EE':
                  return data[0].ee;
                  case 'Stop Point':
                  return data[0].stop ? 'TRUE' : 'FALSE';
                  case 'Velocity':
                  return data[0].vel;
                  case 'Acceleration':
                  return data[0].acc;
                  case 'Corner distance':
                  return data[0].corner;
                  default:
                  return param.defaultValue;
              }
            });
            setParameterValues(newParameterValues);
            const newCoordinateValues = coordinateRows.map(row => {
              return row.map(item => {
                switch (item.label) {
                  case 'X': return { ...item, main: `+${data[0].x.toFixed(2)}` };
                  case 'Y': return { ...item, main: `+${data[0].y.toFixed(2)}` };
                  case 'Z': return { ...item, main: `+${data[0].z.toFixed(2)}` };
                  case 'RX': return { ...item, main: `+${data[0].roll.toFixed(2)}` };
                  case 'RY': return { ...item, main: `+${data[0].pitch.toFixed(2)}` };
                  case 'RZ': return { ...item, main: `+${data[0].yaw.toFixed(2)}` };
                  case 'Tool': return { ...item, main: `${data[0].tool}` };
                  case 'Figure': return { ...item, main: `+${data[0].figure}` };
                  case 'Work': return { ...item, main: `${data[0].work}` };
                  default: return item;
                }
              });
            });
            setCoordinateValues(newCoordinateValues);
          } catch (error) {
              console.error("Error:", error);
          }
      };
    
      useEffect(() => {
          fetchLoadData();
      }, [selectedPoint]); 

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
                {coordinateValues.map((row, rowIndex) => (
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
