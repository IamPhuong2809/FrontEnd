import React, { useState } from 'react'
import './PositionList.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar'
import { useRobotData } from '@components/Control_6dof/RobotData'
const url = "http://127.0.0.1:8000/api/"

const PositionList = () => {

    const { robotData, setRobotData} = useRobotData(); 

	//#region List of Points
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
	//#endregion

    //#region Popup Screen
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    const handleDetailClose = () => {
        setIsDetailOpen(false);
        setSelectedPoint(null);
    };

    const handlePointSelect = (point) => {
        setSelectedPoint(point);
        setIsDetailOpen(true);
    };

    const currentPosition = [
        { label: "X", value: `${robotData.positionCurrent.x.toFixed(2)}mm` },
        { label: "Y", value: `${robotData.positionCurrent.y.toFixed(2)}mm` },
        { label: "Z", value: `${robotData.positionCurrent.z.toFixed(2)}mm` },
        { label:"Tool", value: `${robotData.tool}`},
        { label: "Roll", value: `${robotData.positionCurrent.rl.toFixed(2)}°` },
        { label: "Pitch", value: `${robotData.positionCurrent.pt.toFixed(2)}°` },
        { label: "Yaw", value: `${robotData.positionCurrent.yw.toFixed(2)}°` },
    ]

    const desiredPosition = [
        { label: 'X', value: '-57.54mm' },
        { label: 'Y', value: '210.00mm' },
        { label: 'Z', value: '463.14mm' },
        { label: 'RX', value: '180.00°' },
        { label: 'RY', value: '20.00°' },
        { label: 'RZ', value: '-81.49°' },
        { label: 'FIG', value: '5' }
    ];

    const PopupScreen = () => {
        
        if (!selectedPoint) return null;

        const handleMoveToPoint = () => {
            console.log("move");
        };

        const handleAbort = () => {
            console.log("abort");
        };

        return (
            <div className='point-detail-position'>
                <div className="point-detail-header">
                    <div className="point-detail-title">[Point {selectedPoint.id}] "{selectedPoint.name}"</div>
                    <button className="close-button" onClick={handleDetailClose}>✕</button>
                </div>

                <div className="move-to-point-container">
                    <div className="dialog-header">
                        <span>Move to point</span>
                    </div>
                    <div className="note-header">
                        NOTE: Do you want to move to the point [{selectedPoint.id}] "{selectedPoint.name}"?
                    </div>
                    
                    <div className="dialog-content">
                        <div className="note-section">
                            <div className="option-spans">
                                <div className="option-span-top">
                                    <span
                                    className={`option-span busy ${robotData.busy ? 'on' : ''}`}
                                    >
                                    BUSY
                                    </span>
                                    <span 
                                    className={`option-span active ${robotData.Power ? 'on' : ''}`}
                                    >
                                    ACTIVE
                                    </span>
                                    <span 
                                    className={`option-span error ${robotData.error ? 'on' : ''}`}
                                    >
                                    ERROR
                                    </span>
                                </div>
                                <div className="option-span-bottom">
                                    <span 
                                    className={`option-span done ${!robotData.busy ? 'on' : ''}`}
                                    >
                                    DONE
                                    </span>
                                    <span 
                                    className={`option-span abort ${robotData.abort ? 'on' : ''}`}
                                    >
                                    ABORTED
                                    </span>
                                </div>
                            </div>
                        
                            <div className="error-text">
                                Error Text:
                            </div>

                            <div className="action-buttons">
                                <button className="move-button" onClick={handleMoveToPoint}>
                                MOVE TO POINT
                                </button>
                                <button className="abort-button" onClick={handleAbort}>
                                Abort Movement
                                </button>
                            </div>
                        </div>

                        <div className="position-section-desired">
                            <div className="position-header">Desired Position:</div>
                                <div className="position-data">
                                {desiredPosition.map((item) => (
                                    <div className="position-row" key={item.label}>
                                        <div className="position-label">{item.label}</div>
                                        <div className="position-value">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="position-section-current">
                        <div className="position-header">Current Position:</div>
                        <div className="position-data">
                            {currentPosition.map((item) => (
                                <div className="position-data" key={item.label}>
                                    <div className="position-row" >
                                        <div className="position-label">{item.label}</div>
                                        <div className="position-value">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    //#endregion

    //#region Backend
    const handleMove = async () => {
        try {
            fetch(url + "O0014/", {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAbort = async () => {
        try {
            fetch(url + "O0015/", {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //#endregion

    return (
    <div>
        <HeaderControl />
        <Menu />
        <div className="position-list-robot-container">
            <TaskBar />
            <div className="point-management">
                <List 
                    items={points} 
                    SelectedItem={selectedPoint} 
                    isPopupOpen={true}
                    handleItemSelect={handlePointSelect}
                    handleDetailClose={handleDetailClose}
                    headerName="Point Name" 
                    width="30vw"
                />

                {isDetailOpen && PopupScreen && (
                    <PopupScreen key={selectedPoint?.id || 'default'} />
                )}
            </div>
        </div>
    </div>
    )
}

export default PositionList