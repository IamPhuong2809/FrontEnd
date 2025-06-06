import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import './Move.css';
import Menu from '@components/Control_6dof/Menu/Menu';
import HeaderControl from '@components/Header/Header';
import PopupGlobal from '@components/Control_6dof/PopupGlobal/PopupGlobal'
import PopupPoint from '@components/Control_6dof/PopupPoint/PopupPoint'
import { handleInputChange } from '@utils/inputValidation';
import { useCounter } from '@utils/counterUtils';
import { useRobotData } from '@components/Control_6dof/RobotData';

const url = "http://127.0.0.1:8000/api/"

const Move = () => {
    const navigate = useNavigate();
    const { robotData } = useRobotData();

    //#region Left Content Area
    //#region Declaration variable left content

    const[isJog, setIsJog] = useState(true);
    const [activeJogButton, setActiveJogButton] = useState('Work');
    const [activeMoveButton, setActiveMoveButton] = useState(null);
    //#endregion

    //#region Velocity and Acceleration
    const {
        value: velocity,
        handleMouseDown: handleMouseDownVelocity,
        handleMouseUp: handleMouseUpVelocity
      } = useCounter(5, 1, 150);
    
    const {
        value: acceleration,
        handleMouseDown: handleMouseDownAcceleration,
        handleMouseUp: handleMouseUpAcceleration
    } = useCounter(5, 1, 150);
    //#endregion

    const handleJogButtonClick = (label) => {
        setActiveJogButton(label);
        setActiveMoveButton(null);
        setIsJog(true);
        setCurrentUnitShow(label === "Joint" ? 0 : 1);
        if (label === "Joint") {
            jointCounters[0].setCurrentValue(robotData.jointCurrent.t1);
            jointCounters[1].setCurrentValue(robotData.jointCurrent.t2);
            jointCounters[2].setCurrentValue(robotData.jointCurrent.t3);
            jointCounters[3].setCurrentValue(robotData.jointCurrent.t4);
            jointCounters[4].setCurrentValue(robotData.jointCurrent.t5);
            jointCounters[5].setCurrentValue(robotData.jointCurrent.t6);
        } else {
            jointCounters[0].setCurrentValue(robotData.positionCurrent.x);
            jointCounters[1].setCurrentValue(robotData.positionCurrent.y);
            jointCounters[2].setCurrentValue(robotData.positionCurrent.z);
            jointCounters[3].setCurrentValue(robotData.positionCurrent.rl);
            jointCounters[4].setCurrentValue(robotData.positionCurrent.pt);
            jointCounters[5].setCurrentValue(robotData.positionCurrent.yw);
        }
    };

    const handleMoveButtonClick = (label) => {
        setActiveMoveButton(label);
        setActiveJogButton(null);
        setIsJog(false);
        setCurrentUnitShow(label === "Joint" ? 0 : 1);
    };
    //#endregion

    //#region Right Content Area

    //#region Declaration variable right content
    const jointInputRead = [
        { label: 'J1', value: robotData.positionCurrent.x }, 
        { label: 'J2', value: robotData.positionCurrent.y }, 
        { label: 'J3', value: robotData.positionCurrent.z }, 
        { label: 'J4', value: robotData.positionCurrent.rl }, 
        { label: 'J5', value: robotData.positionCurrent.pt }, 
        { label: 'J6', value: robotData.positionCurrent.yw }, 
    ];
    const initialJointInput = jointInputRead.map(joint => ({
    ...joint,
    input: joint.value
    }));

    const [JointInput, setJointInput] = useState(initialJointInput);
    const [currentUnitShow, setCurrentUnitShow] = useState(1);

    const UnitShow = ['°', 'mm'];
    const LabelShow = [
        ['J1', 'X',],
        ['J2', 'Y'],
        ['J3', 'Z'],
        ['J4', 'RX'],
        ['J5', 'RY'],
        ['J6', 'RZ'],
    ];

    const LimitRangeRobot = [
        [[-180, 180],[-20, 100]],
        [[-90, 90],[-90, 90]],
        [[-45, 135],[0, 145]],
        [[-90, 90],[-180, 180]],
        [[-90, 90],[-180, 180]],
        [[-180, 180],[-180, 180]],
    ]

    const {
        value: stepsize,
        handleMouseDown: handleMouseDownStepsize,
        handleMouseUp: handleMouseUpStepsize
      } = useCounter(0.5, 0.5, 170);
    
    const {
        value: duration,
        handleMouseDown: handleMouseDownDuration,
        handleMouseUp: handleMouseUpDuration
    } = useCounter(300, 10, 170);
    
    // Tạo 6 counters riêng biệt cho 6 joint
    const jointCounters = [
        useCounter(jointInputRead[0].value, stepsize, duration), //LimitRangeRobot[1][currentUnitShow]
        useCounter(jointInputRead[1].value, stepsize, duration),
        useCounter(jointInputRead[2].value, stepsize, duration),
        useCounter(jointInputRead[3].value, stepsize, duration),
        useCounter(jointInputRead[4].value, stepsize, duration),
        useCounter(jointInputRead[5].value, stepsize, duration),
    ];

    // Cập nhật JointCounter khi các giá trị counter thay đổi
    useEffect(() => {
        const newJointInput = jointCounters.map((counter, index) => ({
            label: LabelShow[index][currentUnitShow],
            value: counter.value,
            input: counter.value,
        }));
        setJointInput(newJointInput);
        sendJointUpdate(newJointInput);
    }, [jointCounters.map(counter => counter.value).join(',')]);

    //#endregion

    //#region Increase and Decrease JogMode
    const handleJointIncrement = (index) => {
        jointCounters[index].handleMouseDown("increase", LimitRangeRobot[index][currentUnitShow]);
    };

    const handleJointDecrement = (index) => {
        jointCounters[index].handleMouseDown("decrease", LimitRangeRobot[index][currentUnitShow]);
    };

    const handleJointButtonRelease = (index) => {
        jointCounters[index].handleMouseUp();
    };
    //#endregion

    //#region Popup
    const [showPopupGlobal, setShowPopupGlobal] = useState(false);

    const PopupWrapper = useMemo(() => {
        if (!showPopupGlobal) return null;

        const ClosePopup = () => {
            setShowPopupGlobal(false);
        }
        console.log(JointInput)
        console.log(jointInputRead)
        let joint = JointInput.map(joint => parseFloat(joint.value));;
        
        return (
          <div className="popup-overlay">
            <div className="popup-content">
              <PopupGlobal 
                ClosePopup={ClosePopup}
                joint={joint}
              />
            </div>
          </div>
        );
      }, [showPopupGlobal]);

      const [showPopupPoint, setShowPopupPoint] = useState(false);

      const PopupWrapperPoint = useMemo(() => {
          if (!showPopupPoint) return null;
  
          const ClosePopup = () => {
            setShowPopupPoint(false);
          }
          let joint = JointInput.map(joint => parseFloat(joint.value));;
          
          return (
            <div className="popup-overlay">
              <div className="popup-content">
                <PopupPoint
                  ClosePopup={ClosePopup}
                  joint={joint}
                />
              </div>
            </div>
          );
        }, [showPopupPoint]);
    //#endregion

    //#region Backend
    const handleEMG = async () => {
        try {
            fetch(url + "EMG/", {method: 'GET'});
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const sendJointUpdate = async (newJointInput) => {
        try {
            const jointValues = newJointInput.map(joint => joint.value);
            fetch(url + 'O0025/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    joint: jointValues,
                    jogMode: activeJogButton,
                    velocity: velocity,
                    acceleration: acceleration
                })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleReadActualPosition = async () => {
    };

    const handleMove= async () => {
        try {
            const newJointInput = JointInput.map(item => ({
            ...item,
            value: parseFloat(item.input)
            }));
            setJointInput(newJointInput);
            const jointInputs = JointInput.map(joint => parseFloat(joint.input));
            fetch(url + 'O0022/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    joint: jointInputs,
                    moveMode: activeMoveButton,
                    velocity: velocity,
                    acceleration: acceleration
                })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAbort = async () => {
        try {
            fetch(url + "O0023/", {
                method: 'GET'
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleMoveToHome = async () => {
        try {
            fetch(url + "O0024/", {
                method: 'GET'   
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    //#endregion

    return (
        <div>
            <HeaderControl />
            <Menu />
            <div className="move-robot-container">
                {/* Left Content Area */}
                <div className="left-content">
                    <div className="info-controls">
                        <div className="tool-information">
                            <div className="indicator-container">
                                <span className={`indicator ${robotData.S ? 'green' : ''}`}>
                                    S
                                </span>
                                <span className={`indicator ${robotData.I ? 'green' : ''}`}>
                                    I
                                </span>
                                <span className={`indicator ${robotData.AUX ? 'green' : ''}`}>
                                    AUX
                                </span>
                            </div>
                            <div className="override">Override: {robotData.override} %</div>
                        </div>
                        <div className="display-container">
                            <div className="tool-display">Tool: {robotData.tool}</div>
                            <div className="work-display">Work: {robotData.work}</div>
                        </div>
                        <div className="tool-buttons">
                            <button>HELP</button>
                            <button onClick={() => {handleEMG()}}>EMERGENCY</button>
                        </div>
                    </div>
                    <div className="axis-title">MOVE AXIS</div>
                    <div className="robot-visualization">
                        <div className="robot-arm">
                            <div className="robot-base"></div>
                            <div className="robot-arm-upper"></div>
                        </div>
                    </div>
                    <div className="bottom-controls">
                        <div className="left-buttons">
                            <div className={`jog-label ${isJog ? 'active' : ''}`}>JOG</div>
                            <div className='jog-container'>
                                <button
                                    className={`control-btn ${activeJogButton === 'Work' ? 'active' : ''}`}
                                    onClick={() => handleJogButtonClick('Work')}
                                >
                                    Work
                                </button>
                                <button 
                                    className={`control-btn ${activeJogButton === 'Joint' ? 'active' : ''}`} 
                                    onClick={() => handleJogButtonClick('Joint')}
                                >
                                    Joint
                                </button>
                                <button 
                                    className={`control-btn ${activeJogButton === 'Tool' ? 'active' : ''}`} 
                                    onClick={() => handleJogButtonClick('Tool')}
                                >
                                    Tool
                                </button>
                            </div>
                        </div>
                        <div className="right-buttons">
                            <div className={`move-label ${isJog ? '' : 'active'}`}>MOVE</div>
                            <div className='move-container'>
                                <button 
                                    className={`control-btn ${activeMoveButton === 'LIN' ? 'active' : ''}`}
                                    onClick={() => handleMoveButtonClick('LIN')}
                                >
                                    LIN
                                </button>
                                <button 
                                    className={`control-btn ${activeMoveButton === 'Joint' ? 'active' : ''}`}
                                    onClick={() => handleMoveButtonClick('Joint')}
                                >
                                    Joint
                                </button>
                                <button 
                                    className={`control-btn ${activeMoveButton === 'PTP' ? 'active' : ''}`}
                                    onClick={() => handleMoveButtonClick('PTP')}
                                >
                                    PTP
                                </button>
                            </div>
                        </div>
                        <div className="settings-panel">
                            <div className='velocity-container'>
                                <div>
                                    <div className="setting-label">Velocity</div>
                                    <div className="setting-value">{velocity} %</div>
                                </div>
                                <div>
                                <button 
                                    className="btn-change" 
                                    onMouseDown={() => handleMouseDownVelocity("increase", [0, 100])}
                                    onMouseUp={handleMouseUpVelocity}
                                    onMouseLeave={handleMouseUpVelocity}
                                >
                                    V+
                                </button>
                                <button 
                                    className="btn-change" 
                                    onMouseDown={() => handleMouseDownVelocity("decrease", [0, 100])} 
                                    onMouseUp={handleMouseUpVelocity}
                                    onMouseLeave={handleMouseUpVelocity}
                                >
                                    V-
                                </button>
                                </div>
                            </div>
                            <div className='acceleration-container'>
                                <div>
                                <div className="setting-label">Acceleration</div>
                                <div className="setting-value">{acceleration} %</div>
                                </div>
                                <div>
                                    <button 
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownAcceleration("increase", [0, 100])}
                                        onMouseUp={handleMouseUpAcceleration}
                                        onMouseLeave={handleMouseUpAcceleration}
                                    >
                                        A+
                                    </button>
                                    <button 
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownAcceleration("decrease", [0, 100])}
                                        onMouseUp={handleMouseUpAcceleration}
                                        onMouseLeave={handleMouseUpAcceleration}
                                    >
                                        A-
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right content */}
                <div className='right-content'>
                    {!isJog ? (
                        <motion.div
                        key="job"
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0}}
                        transition={{ duration: 0.6 }}
                        >
                            <div className="joint-panel jog-true">
                                {/* Left panel cũ */}
                                <div className="left-panel">
                                    {JointInput.slice(0, 3).map((joint, index) => (
                                        <div className="joint-control-left" key={index}>
                                            <div className="joint-label">{LabelShow[index][currentUnitShow]}</div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={joint.input}
                                                    className="joint-input"
                                                    onChange={(e) => handleInputChange(e, index, JointInput,
                                                         setJointInput, LimitRangeRobot[index][currentUnitShow])}
                                                />
                                                <div className="joint-value">
                                                    {activeMoveButton === "Joint"
                                                        ? robotData.jointCurrent[`t${index + 1}`]?.toFixed(2) + "°"
                                                        : Object.values(robotData.positionCurrent)[index]?.toFixed(2) + "mm"
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Right panel cũ */}
                                <div className="right-panel">
                                    {JointInput.slice(3, 6).map((joint, index) => (
                                        <div className="joint-control-right" key={index + 3}>
                                            <div className="joint-label">{LabelShow[index + 3][currentUnitShow]}</div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={joint.input}
                                                    className="joint-input"
                                                    onChange={(e) => handleInputChange(e, index + 3, JointInput,
                                                         setJointInput, LimitRangeRobot[index+3][currentUnitShow])}
                                                />
                                                <div className="joint-value">                                                    
                                                    {activeMoveButton === "Joint"
                                                        ? robotData.jointCurrent[`t${index + 4}`]?.toFixed(2) + "°"
                                                        : Object.values(robotData.positionCurrent)[index + 3]?.toFixed(2) + "mm"
                                                    }</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                        key="joint"
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0}}
                        transition={{ duration: 0.4 }}
                        >
                            <div className="joint-panel jog-false">
                                <div className="left-panel">
                                    {JointInput.slice(0, 3).map((joint, index) => (
                                        <div className="joint-control-left" key={index}>
                                            <div className="joint-btn-container">
                                                <button 
                                                    className="joint-btn"
                                                    onMouseDown={() => handleJointIncrement(index)}
                                                    onMouseUp={() => handleJointButtonRelease(index)}
                                                    onMouseLeave={() => handleJointButtonRelease(index)}
                                                > 
                                                    {LabelShow[index][currentUnitShow]}+ 
                                                </button>
                                                <button 
                                                    className="joint-btn"
                                                    onMouseDown={() => handleJointDecrement(index)}
                                                    onMouseUp={() => handleJointButtonRelease(index)}
                                                    onMouseLeave={() => handleJointButtonRelease(index)}
                                                > 
                                                    {LabelShow[index][currentUnitShow]}- 
                                                </button>
                                            </div>
                                            <div className="joint-value">{jointCounters[index].value.toFixed(2)}{UnitShow[currentUnitShow]}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="right-panel">
                                    {JointInput.slice(3, 6).map((joint, index) => (
                                        <div className="joint-control-right" key={index + 3}>
                                            <div className="joint-btn-container">
                                                <button 
                                                    className="joint-btn"
                                                    onMouseDown={() => handleJointIncrement(index + 3)}
                                                    onMouseUp={() => handleJointButtonRelease(index + 3)}
                                                    onMouseLeave={() => handleJointButtonRelease(index + 3)}
                                                > 
                                                    {LabelShow[index+3][currentUnitShow]}+ 
                                                </button>
                                                <button 
                                                    className="joint-btn"
                                                    onMouseDown={() => handleJointDecrement(index + 3)}
                                                    onMouseUp={() => handleJointButtonRelease(index + 3)}
                                                    onMouseLeave={() => handleJointButtonRelease(index + 3)}
                                                > 
                                                    {LabelShow[index+3][currentUnitShow]}- 
                                                </button>
                                            </div>
                                            <div className="joint-value">{jointCounters[index + 3].value.toFixed(2)}°</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div className="button-control-panel">
                        <div className='button-top'>
                            <motion.div
                                key={isJog ? "settings-step" : "button-row"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {isJog ? (
                                <div className="settings-step">
                                    <div className="velocity-container">
                                    <div>
                                        <div className="setting-label">Stepsize</div>
                                        <div className="setting-value">{stepsize.toFixed(1)}</div>
                                    </div>
                                    <div>
                                        <button 
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownStepsize("increase", [0.5, 10])}
                                        onMouseUp={handleMouseUpStepsize}
                                        onMouseLeave={handleMouseUpStepsize}
                                        >
                                        S+
                                        </button>
                                        <button 
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownStepsize("decrease", [0.5, 10])} 
                                        onMouseUp={handleMouseUpStepsize}
                                        onMouseLeave={handleMouseUpStepsize}
                                        >
                                        S-
                                        </button>
                                    </div>
                                    </div>
                                    <div className="acceleration-container">
                                    <div>
                                        <div className="setting-label">Duration</div>
                                        <div className="setting-value">{duration} ms</div>
                                    </div>
                                    <div>
                                        <button 
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownDuration("increase", [50, 200])}
                                        onMouseUp={handleMouseUpDuration}
                                        onMouseLeave={handleMouseUpDuration}
                                        >
                                        D+
                                        </button>
                                        <button 
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownDuration("decrease", [50, 200])}
                                        onMouseUp={handleMouseUpDuration}
                                        onMouseLeave={handleMouseUpDuration}
                                        >
                                        D-
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                ) : (
                                <div className="button-row">
                                    <button 
                                        className={`control-button-tall ${isJog ? '' : 'active'}`}
                                        onClick={handleReadActualPosition}
                                    >
                                        Read Actual Position
                                    </button>
                                    <button 
                                        className={`control-button-tall ${isJog ? '' : 'active'}`}
                                        onClick={handleMove}
                                    >
                                        Move
                                    </button>
                                </div>
                                )}
                            </motion.div>
                            
                            <div className="button-row">
                                <button 
                                    className="control-button"
                                    onClick={handleAbort}
                                >
                                    Abort
                                </button>
                                <button 
                                    className="control-button"
                                    onClick={handleMoveToHome}
                                >
                                    Move to Home
                                </button>
                            </div>
                        </div>
                        
                        <div className="button-bottom">
                            <div className="info-row">
                                <span className={`info-span ${robotData.busy ? 'busy' : ''}`}>BUSY</span>
                                <span className={`info-span small ${robotData.Power ? 'active' : ''}`}>ACTIVE</span>
                                <span className={`info-span ${robotData.error  ? 'error' : ''}`}>ERROR</span>
                            </div>
                            <div className="button-row">
                                <button 
                                    className="control-button"
                                    onClick={() => setShowPopupPoint(true)}
                                >
                                    Teach Position
                                </button>
                                <button 
                                    className="control-button small"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                                <button 
                                    className="control-button"
                                    onClick={() => setShowPopupGlobal(true)}
                                >
                                    Position List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {PopupWrapper} 
            {PopupWrapperPoint}
        </div>
    );
};

export default Move;