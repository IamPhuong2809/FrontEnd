import React, { useState, useEffect, useRef } from 'react'
import './MovePath.css'
import toast from 'react-hot-toast';
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Header/Header'
import List from '@components/Control_6dof/List/List'
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar'
import leftArrow from '@images/left-arrow.png'
import rightArrow from '@images/right-arrow.png'
import stopIcon from '@images/stop.png'
import playIcon from '@images/play.png'
import pauseIcon from '@images/pause.png'
import { useRobotData } from '@components/Control_6dof/RobotData'
import Loading from '@components/Loading/Loading'
import { API_URL } from '@utils/config';


const MovePath = () => {

    //#region api 
        const [paths, setPaths] = useState(null);
        const [points, setPoints] = useState(null);
        const [loading, setLoading] = useState(true); 
    
        const fetchLoadData = async (id) => {
            try {
                const response = await fetch(API_URL + "O0008/", {
                    method: "GET",
                });
                const data = await response.json();
                setPaths(data);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        };
    
        useEffect(() => {
            fetchLoadData();
        }, []); 
    
        const LoadPointInDB = async (id) => {
            try {
                const response = await fetch(API_URL + "point/", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, type: null })
                });
                const data = await response.json();
                setPoints(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        
        //#endregion

    const [isPointOpen, setIsPointOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState(null);
    
    const handlePointClose = () => {
        setIsPointOpen(false);
        setSelectedPath(null);
    };

    const handlePathSelect =async (path) => {
        setSelectedPath(path);
        setIsPointOpen(true);
        await LoadPointInDB(path.id);
    };
    //#endregion

    if (loading) {
        return <Loading/>;
    }

    const PopupScreen = () => {
        const { robotData } = useRobotData(); 

        //#region control mode
        const [isStepMode, setIsStepMode] = useState(false);
        const [isRunning, setIsRunning] = useState(false);
        const [selectedPointIndex, setSelectedPointIndex] = useState(-1);
        const [isButtonDisable, setIsButtonDisable] = useState(true);
        const Gripper = useRef(null);

        useEffect(() => {
            if (robotData.busy === 0) {
                if (!isStepMode && isRunning) {
                    console.log(Gripper.current)
                    if(Gripper.current !== null && Gripper.current !== 'SKIP'){
                        handleGrip();
                    }
                    else{
                        setSelectedPointIndex(prev => {
                            if (prev >= points.length - 1) {
                                setIsRunning(false);
                                return -1;
                            }
                        console.log(prev);
                            return prev + 1;
                        });
                    }
                }
            }
            if(isStepMode)
                setIsButtonDisable(robotData.busy);
            else
                setIsButtonDisable(true);
        }, [robotData.busy, isStepMode, isRunning]);
        

        const handleStep = (direction) => {
            if (!isStepMode || robotData.busy) return;

            setSelectedPointIndex(prev => {
                const newIndex = prev + direction;
                if(newIndex > points.length - 1)
                    return 0;
                if(newIndex < 0)
                    return points.length - 1;
                return newIndex;
            });
        };

        useEffect(() => {
            setSelectedPointIndex(-1);
        }, [selectedPath]);

        // Hàm toggle Step Mode
        const handleToggleStepMode = () => {
            setIsStepMode((prev) => !prev);
            setIsRunning(false);
        };

        const handleRunning = () => {
            if(!isRunning){
                setSelectedPointIndex(-1);
            }
            setIsRunning((prev) => !prev);
        }
        //#endregion

        useEffect(() => {
            if(selectedPointIndex === -1)
                return;
            SendId(selectedPointIndex);
        },[selectedPointIndex])

        const handleGrip = async () => {
            try {
                const response = await fetch(API_URL + "grip/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        grip: Gripper.current,
                    }),
                });
                Gripper.current = null;
                const data = await response.json();
                if (data.success) {
                    if(Gripper.current === "GRIP"){
                        toast.success("Grasping object", {
                            style: { border: "1px solid green" },
                          });
                    }
                    else if(Gripper.current === "RELEASE"){
                        toast.success("Releasing object", {
                            style: { border: "1px solid green" },
                          });
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        const SendId = async (id) => {
            try {
                const response = await fetch(API_URL + "O0026/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idPath: selectedPath.id,
                        idPoint: id + 1,
                        stepMode: isStepMode
                    }),
                });
                const data = await response.json();
                if (data.success) { 
                    Gripper.current = data.grip.ee;
                    console.log(data.grip)
                    console.log(Gripper.current)
                    toast.success(`Running position: ${points[selectedPointIndex].name}`, {
                      style: { border: "1px solid green" },
                    });
                  } else {
                    toast.error("Failed to move", {
                      style: { border: "1px solid red" },
                    });
                  }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        return(
            <div className='point-detail-movepath'>
                <div className="path-detail-header">
                    <div className="path-detail-title">[Path {selectedPath.id}] "{selectedPath.name}"</div>
                    <button className="close-button" onClick={handlePointClose}>✕</button>
                </div>
                <div className='points-list-move-path'>
                    {points && points.map((point, index) => (
                        <div 
                            key={point.id} 
                            className={`point-item ${
                                index === selectedPointIndex ? 
                                  (robotData.busy ? 'selected-busy' : 'selected') 
                                  : ''
                            }`}
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
                    <div 
                        className={`img-container ${isButtonDisable ? 'btn-disabled' : ''}`}
                        onClick={() => handleStep(-1)}
                    >
                        <img src={leftArrow} alt="left-arrow" className="btn-left" />
                    </div>
                    <div 
                        className={`img-container ${isButtonDisable ? 'btn-disabled' : ''}`}
                        onClick={() => handleStep(1)}    
                    >
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