import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './PopupTeachPath.css';
import toast from 'react-hot-toast';
import { API_URL } from '@utils/config';
import { handleInputChange } from '@utils/inputValidation';

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
        options: ['LIN', 'PTP', 'P&P'],   // 3 item cho dropdown
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
    const [task, setTask] = useState("SKIP");
    const [idAruco, setIdAruco] = useState(0);
    const [ee, setEE] = useState("SKIP");
    const [stopPoint, setStopPoint] = useState("FALSE")

    const parameterConfigAruco = [
        {
        label: 'Motion Typ',
        type: 'select',
        options: ['LIN', 'PTP', 'P&P'],  
        defaultValue: 'LIN'
        },
        {
        label: 'Task',
        type: 'select',
        options: ['PICK', 'PLACE', 'SKIP'], 
        defaultValue: 'SKIP'
        },
        {
        label: 'Id Aruco',
        type: 'text',
        defaultValue: '0'
        },
    ];

    const coordinateRows = [
      [
        { label: 'X', main: '0.00'},
        { label: 'Y', main: '210.00'},
        { label: 'Z', main: '495.00'}

      ],
      [
        { label: 'RX', main: '180.00'},
        { label: 'RY', main: '0.00'},
        { label: 'RZ', main: '81.99'}
      ],
      [
          { label: 'Tool', main: '0'},
          { label: 'Figure', main: '+5'},
          { label: 'Work', main: '0'}
      ]
    ];

    const [positionInputs, setPositionInputs] = useState([
    { label: 'X', input: '0.0' },
    { label: 'Y', input: '0.0' },
    { label: 'Z', input: '0.0' },
    { label: 'RX', input: '0.0' },
    { label: 'RY', input: '0.0' },
    { label: 'RZ', input: '0.0' },
    ]);
    const handleJog = async () => {
        try {
            const response = await fetch(API_URL + 'O0017/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idPath: selectedPath.id,
                    idPoint: selectedPoint.id
                })
            });
            const data = await response.json()
            if(!data.success){
                toast.error("Failed to move", {
                    style: {border: '1px solid red'}});
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [parameterValues, setParameterValues] = useState(
        parameterConfig.map(param => param.defaultValue)
    );

    const motionType = parameterValues[0] || 'LIN';
    const isPickAndPlace = motionType === 'P&P';
    const parameterConfigToUse = isPickAndPlace ? parameterConfigAruco : parameterConfig;

    const [coordinateValues, setCoordinateValues] = useState(coordinateRows);

    const navigate = useNavigate();
    //#endregion

    const handleSave = async () => {
        try {
            const posValues = positionInputs.map(joint => joint.input);
            const response = await fetch(API_URL + "O0016/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: parameterValues,
                    idPath: selectedPath.id,
                    idPoint: selectedPoint.id,
                    pos: posValues,
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
                  return data.motion;
                  case 'EE':
                  return data.ee;
                  case 'Stop Point':
                  return data.stop ? 'TRUE' : 'FALSE';
                  case 'Velocity':
                  return data.vel;
                  case 'Acceleration':
                  return data.acc;
                  case 'Corner distance':
                  return data.corner;
                  default:
                  return param.defaultValue;
              }
            });
            setEE(data.ee);
            setStopPoint(data.stop ? 'TRUE' : 'FALSE');
            setParameterValues(newParameterValues);
            const newCoordinateValues = coordinateRows.map(row => {
              return row.map(item => {
                switch (item.label) {
                  case 'X': return { ...item, main: `${data.x.toFixed(2)}` };
                  case 'Y': return { ...item, main: `${data.y.toFixed(2)}` };
                  case 'Z': return { ...item, main: `${data.z.toFixed(2)}` };
                  case 'RX': return { ...item, main: `${data.roll.toFixed(2)}` };
                  case 'RY': return { ...item, main: `${data.pitch.toFixed(2)}` };
                  case 'RZ': return { ...item, main: `${data.yaw.toFixed(2)}` };
                  case 'Tool': return { ...item, main: `${data.tool}` };
                  case 'Figure': return { ...item, main: `+${data.figure}` };
                  case 'Work': return { ...item, main: `${data.work}` };
                  default: return item;
                }
              });
            });

            if (data.aruco) {
                setPositionInputs([
                    { label: 'X', input: data.aruco.x.toFixed(2) },
                    { label: 'Y', input: data.aruco.y.toFixed(2) },
                    { label: 'Z', input: data.aruco.z.toFixed(2) },
                    { label: 'RX', input: data.aruco.roll.toFixed(2) },
                    { label: 'RY', input: data.aruco.pitch.toFixed(2) },
                    { label: 'RZ', input: data.aruco.yaw.toFixed(2) },
                ]);
                setIdAruco(data.aruco.id_aruco);
                setTask(data.aruco.task);
            }
            else{
                setPositionInputs([
                    { label: 'X', input: '0.0' },
                    { label: 'Y', input: '0.0' },
                    { label: 'Z', input: '0.0' },
                    { label: 'RX', input: '0.0' },
                    { label: 'RY', input: '0.0' },
                    { label: 'RZ', input: '0.0' },
                ]);
                setIdAruco(0);
                setTask("SKIP");
            }
            
            setCoordinateValues(newCoordinateValues);
          } catch (error) {
              console.error("Error:", error);
          }
      };
    
      useEffect(() => {
          fetchLoadData();
      }, [selectedPoint]); 

      useEffect(() => {
        if(isPickAndPlace){
            const updated = [...parameterValues];
            updated[1] = task;
            updated[2] = idAruco.toString();
            setParameterValues(updated);
        }
        else{
            const updated = [...parameterValues];
            updated[1] = ee;
            updated[2] = stopPoint;
            setParameterValues(updated);
        }
      }, [isPickAndPlace])

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

            {isPickAndPlace ? (
                <div className="pp-input-container">
                    <div className="pp-input-row">
                        {positionInputs.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="pp-input-item">
                                <label>{item.label}</label>
                                <input 
                                    type="text" 
                                    value={item.input}
                                    onChange={(e) =>
                                        handleInputChange(e, idx, positionInputs, setPositionInputs, [-1000, 1000])
                                    }/>
                            </div>
                        ))}
                    </div>
                    <div className="pp-input-row">
                        {positionInputs.slice(3, 6).map((item, idx) => (
                            <div key={idx} className="pp-input-item">
                                <label>{item.label}</label>
                                <input 
                                    type="text" 
                                    value={item.input}
                                    onChange={(e) =>
                                        handleInputChange(e, idx + 3, positionInputs, setPositionInputs, [-1000, 1000])
                                    }/>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
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
            )}

            <div className="parameter-form-container">
                {parameterConfigToUse.map((param, index) => (
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
                            value={parameterValues[index] ?? ''}
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
                    }}
                >
                    Save
                </button>
                <button 
                    className="button-item"
                    onClick={() => {
                        handleJog();
                        navigate('/6dof/Move');
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
