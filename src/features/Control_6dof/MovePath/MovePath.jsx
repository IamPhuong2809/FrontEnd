import React, { useState, useEffect } from 'react'
import './MovePath.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar'
import leftArrow from '@images/left-arrow.png'
import rightArrow from '@images/right-arrow.png'
import stopIcon from '@images/stop.png'
import playIcon from '@images/play.png'
import pauseIcon from '@images/pause.png'

const MovePath = () => {

    //#region List of Paths
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
        { id: 15, name: 'type_a_name' },
        { id: 16, name: 'type_a_name' },
    ];

    const [isPointOpen, setIsPointOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    
    const handlePointClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsPointOpen(false);
            setSelectedPath(null);
            setIsClosing(false);
        }, 800);
    };

    const handlePathSelect = (path) => {
        if(isPointOpen) {
            handlePointClose();
            setTimeout(() => {
                setSelectedPath(path);
                setIsPointOpen(true);
            }, 800);
        }
        else {
            setSelectedPath(path);
            setIsPointOpen(true);
        }
    };
    //#endregion

    const PopupScreen = () => {

        //#region control mode
        const [isStepMode, setIsStepMode] = useState(false);
        const [isRunning, setIsRunning] = useState(false);

        // Hàm toggle Step Mode
        const handleToggleStepMode = () => {
        setIsStepMode((prev) => !prev);
        };

        const handleRunning = () => {
            setIsRunning((prev) => !prev);
        }
        //#endregion

        return(
            <div className={`point-detail-movepath ${isClosing ? 'slide-out' : 'slide-in'}`}>
                <div className="path-detail-header">
                    <div className="path-detail-title">[Path {selectedPath.id}] "{selectedPath.name}"</div>
                    <button className="close-button" onClick={handlePointClose}>✕</button>
                </div>
                <div className='points-list-move-path'>
                    {points && points.map((point) => (
                        <div 
                            key={point.id} 
                            className={`point-item`}
                        >
                            <div className='point-no'>{point.id}</div>
                            <div className='point-name'>{point.name}</div>
                        </div>
                    ))}
                </div>
                <div className="control-move-path">
                    <div className='img-container'>
                        <img src={stopIcon} alt="stop-icon" className="btn-stop" />
                    </div>
                    <div className={`img-container ${!isStepMode ? '' : 'btn-disabled'}`} onClick={!isStepMode ? handleRunning : null}>
                        <img src={isRunning ? pauseIcon : playIcon} alt="play-icon" className="btn-play" />
                    </div>
                    <button
                        className={`btn-step ${isStepMode ? '' : 'btn-disabled'}`}
                        onClick={handleToggleStepMode}
                    >
                        Step Mode
                    </button>
                    <div className={`img-container ${isStepMode ? '' : 'btn-disabled'}`}>
                        <img src={leftArrow} alt="left-arrow" className="btn-left" />
                    </div>
                    <div className={`img-container ${isStepMode ? '' : 'btn-disabled'}`}>
                        <img src={rightArrow} alt="right-arrow" className="btn-right" />
                    </div>
                </div>
            </div>
        )
    };

  return (
   <div>
        <HeaderControl />
        <Menu />
        <div className='move-path-robot-container'> 
            <TaskBar />
            <div className="move-management">
                <List 
                    items={paths} 
                    SelectedItem={selectedPath} 
                    isPopupOpen={isPointOpen}
                    handleItemSelect={handlePathSelect}
                    handleDetailClose={handlePointClose}
                    headerName="Path Name" 
                    width="40vw"
                />

                {isPointOpen && PopupScreen && (
                            <PopupScreen />
                        )}
            </div>
        </div>
   </div>
  )
}

export default MovePath