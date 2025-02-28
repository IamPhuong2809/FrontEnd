import React, {useState} from 'react'
import './TeachPath.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'

const TeachPath = () => {

    //#region List of Points
    const paths =[
        { id: 1, name: 'Take' },
        { id: 2, name: 'Bring' },
        { id: 3, name: 'Place' },
        { id: 4, name: 'Prepick' },
        { id: 5, name: 'Pick' },
        { id: 6, name: 'See' },
        { id: 7, name: 'Run' },
        { id: 8, name: 'type_a_name' },
        { id: 9, name: 'type_a_name' },
        { id: 10, name: 'type_a_name' },
        { id: 11, name: 'type_a_name' },
        { id: 12, name: 'type_a_name' },
        { id: 13, name: 'type_a_name' },
        { id: 14, name: 'type_a_name' },
        ];
    //#endregion

    //#region Point List Screen
    const points =[
        { id: 1, name: 'Home' },
        { id: 2, name: 'Prepick Pos 1' },
        { id: 3, name: 'PickPos 1' },
        { id: 4, name: 'Prepick Pos 2' },
        { id: 5, name: 'Pick Pos 2' },
        { id: 6, name: 'type_a_name' },
        { id: 7, name: 'type_a_name' },
        { id: 8, name: 'type_a_name' },
        { id: 9, name: 'type_a_name' },
        { id: 10, name: 'type_a_name' },
        { id: 11, name: 'type_a_name' },
        { id: 12, name: 'type_a_name' },
        { id: 13, name: 'type_a_name' },
        { id: 14, name: 'type_a_name' },
    ];

    const [isPointOpen, setIsPointOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState(null);
    const [isPointClosing, setIsPointClosing] = useState(false);

    const handlePathSelect = (path) => {
        if(isPointOpen) {
            handlePathClose();
            setTimeout(() => {
                setSelectedPath(path);
                setIsPointOpen(true);
            }, 500);
        }
        else {
            setSelectedPath(path);
            setIsPointOpen(true);
        }
    };

    const handlePathClose = () => {
        setIsPointClosing(true);
        setIsDetailClosing(true);
        setTimeout(() => {
            setIsPointOpen(false);
            setSelectedPath(null);
            setIsPointClosing(false);

            setIsDetailOpen(false);
            setSelectedPoint(null);
            setIsDetailClosing(false);
        }, 500);
    };
    //#endregion

    //#region Detail Point
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isDetailClosing, setIsDetailClosing] = useState(false);

    const handlePointSelect = (point) => {
        if(isDetailOpen) {
            handleDetailClose();
            setTimeout(() => {
                setSelectedPoint(point);
                setIsDetailOpen(true);
            }, 500);
        }
        else {  
            setSelectedPoint(point);
            setIsDetailOpen(true);
        }
    };

    const handleDetailClose = () => {
        setIsDetailClosing(true);
        setTimeout(() => {
            setIsDetailOpen(false);
            setSelectedPoint(null);
            setIsDetailClosing(false);
        }, 500);
    };

    const coordinateRows = [
        [
          { label: 'X', main: '+0.00', sub: '+199.99' },
          { label: 'Y', main: '-210.00', sub: '-210.00' },
          { label: 'Z', main: '+495.00', sub: '+399.97' }

        ],
        [
          { label: 'RX', main: '+180.00', sub: '-179.99' },
          { label: 'RY', main: '+0.00', sub: '-0.01' },
          { label: 'RZ', main: '+81.99', sub: '+81.99' }
        ],
        [
            { label: 'Tool', main: '0', sub: '0' },
            { label: 'Figure', main: '+5', sub: '+5' },
            { label: 'Work', main: '0', sub: '0' }
        ]
      ];

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
        label: 'M_Function',
        type: 'text',
        defaultValue: '999'
        },
        {
        label: 'Velocity',
        type: 'text',
        defaultValue: '10 %'
        },
        {
        label: 'Acceleration',
        type: 'text',
        defaultValue: '10 %'
        },
        {
        label: 'Corner distanc',
        type: 'text',
        defaultValue: '100mm'
        }
    ];

    const PopupScreen = () => {
        return(
            <div className={`point-detail ${isDetailClosing ? 'slide-out' : 'slide-in'}`}>
                <div className="point-detail-header">
                    <div className="point-detail-title">[Point {selectedPoint.id}] "{selectedPoint.name}"</div>
                    <button className="close-button" onClick={handleDetailClose}>✕</button>
                </div>
                <div className="coordinates-container">
                    {coordinateRows.map((row, rowIndex) => (
                        <div className="coordinates-row" key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <div className="coordinates-cell" key={cellIndex}>
                                    <div className="coordinate-label">{cell.label}</div>
                                    <input className="coordinate-value-input" type="text" value={cell.main} />
                                    <div className="coordinate-value-main">{cell.sub}</div>
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
                                defaultValue={param.defaultValue}
                                >
                                    {param.options.map((option, idx) => (
                                        <option key={idx} value={option}>
                                        {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                className="parameter-input"
                                type="text"
                                defaultValue={param.defaultValue}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className='button-container'>
                    <button className='button-item'>Jog</button>
                    <button className='button-item'>Teach</button>
                    <button className='button-save'>Save</button>
                </div>
            </div>
        )
    };
    //#endregion
    
  return (
   <div>
        <HeaderControl />
        <Menu />
        <div className="teach-management">
            <List 
                items={paths} 
                SelectedItem={selectedPath} 
                isPopupOpen={true}
                handleItemSelect={handlePathSelect} 
                handleDetailClose={handlePathClose}
                headerName="Path Name"
            />
            {/* Point List (danh sách thứ hai) */}
            {isPointOpen && (
                <List 
                items={points} 
                SelectedItem={selectedPoint}
                handleItemSelect={handlePointSelect} 
                handleDetailClose={handleDetailClose}
                isPopupClosing={isPointClosing} 
                headerName="Point Name" 
                />
            )}
            
            {/* Detail Screen cho Point được chọn */}
            {isDetailOpen && selectedPoint && (
                <PopupScreen />
            )}
        </div>
   </div>
  )
}

export default TeachPath