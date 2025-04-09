import React, { useState } from 'react'
import './PositionList.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar'
import { useRobotData } from '@components/Control_6dof/RobotData'
import PopupScreen from '@components/Control_6dof/PopupScreen/PopupScreen'
import Loading from '@components/Loading/Loading'

const PositionList = () => {

    const { robotData } = useRobotData(); 

    // const fetchLoadData = async (id, retryCount) => {
    //     try {
    //         const response = await fetch(url + "O0006/", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(id),
    //         });
    //         const data = await response.json();
    //         setFormData(data.dataLoad);
    //         setTitle(data.nameLoad);
    //         setName(data.nameLoad[id]);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };

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

                {isDetailOpen && (
                    <PopupScreen 
                        key={selectedPoint?.id || 'default'} 
                        selectedPoint={selectedPoint} 
                        onClose={handleDetailClose}
                        robotData={robotData}
                    >
                    </PopupScreen>
                )}
                {isDetailOpen && (
                    <div className="position-section-current">
                        <div className="position-header">Current Position:</div>
                        <div className="position-data">
                            {currentPosition.map((item) => (
                            <div className="position-row" key={item.label}>
                                <div className="position-label">{item.label}</div>
                                <div className="position-value">{item.value}</div>
                            </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
    )
}

export default PositionList;