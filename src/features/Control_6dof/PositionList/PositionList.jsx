import React, { useState, useEffect } from 'react'
import './PositionList.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar'
import { useRobotData } from '@components/Control_6dof/RobotData'
import PopupScreen from '@components/Control_6dof/PopupScreen/PopupScreen'
import Loading from '@components/Loading/Loading'

const url = "http://127.0.0.1:8000/api/";

const PositionList = () => {

    const { robotData } = useRobotData(); 
    const [points, setPoints] = useState(null);
    const [loading, setLoading] = useState(true); 

    const fetchLoadData = async (id) => {
        try {
            const response = await fetch(url + "O0006/", {
                method: "GET",
            });
            const data = await response.json();
            setPoints(data);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchLoadData();
    }, []); 

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
        { label: "RX", value: `${robotData.positionCurrent.rl.toFixed(2)}°` },
        { label: "RY", value: `${robotData.positionCurrent.pt.toFixed(2)}°` },
        { label: "RZ", value: `${robotData.positionCurrent.yw.toFixed(2)}°` },
    ]

    if (loading) {
        return <Loading/>;
    }

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
                    headerName="Global Point Name" 
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