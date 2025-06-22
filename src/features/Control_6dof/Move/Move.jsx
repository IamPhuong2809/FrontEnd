import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import './Move.css';
import Menu from '@components/Control_6dof/Menu/Menu';
import HeaderControl from '@components/Header/Header';
import PopupGlobal from '@components/Control_6dof/PopupGlobal/PopupGlobal'
import PopupPoint from '@components/Control_6dof/PopupPoint/PopupPoint'
import ModelRobot from '@images/ModelRobot.jpg';
import { handleInputChange } from '@utils/inputValidation';
import { useCounter } from '@utils/counterUtils';
import { useRobotData } from '@components/Control_6dof/RobotData';
import { API_URL } from '@utils/config';

const Move = () => {
    const navigate = useNavigate();
    const { robotData } = useRobotData();

    //#region Left Content Area
    //#region Declaration variable left content

    const[isJog, setIsJog] = useState(true);
    const [activeJogButton, setActiveJogButton] = useState('Joint');
    const [activeMoveButton, setActiveMoveButton] = useState(null);
    const startWeb = useRef(true);
    //#endregion

    //#region Velocity and Acceleration
    const {
        value: velocity,
        increase: IncreaseVelocity,
        decrease: DecreaseVelocity
      } = useCounter(50, 5, [0, 100]);
    
    const {
        value: acceleration,
        increase: IncreaseAcceleration,
        decrease: DecreaseAcceleration
    } = useCounter(50, 5, [0, 100]);
    //#endregion

    const handleJogButtonClick = (label) => {
        setActiveJogButton(label);
        setActiveMoveButton(null);
        setIsJog(true);
        startWeb.current = true;
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
        handleType(label);
    };

    const handleMoveButtonClick = (label) => {
        setActiveMoveButton(label);
        setActiveJogButton(null);
        startWeb.current = true;
        setIsJog(false);
        setCurrentUnitShow(label === "Joint" ? 0 : 1);
        handleType(label);
    
        // Cập nhật JointInput.input thay vì jointCounter
        const newJointInput = JointInput.map((joint, index) => {
            let newValue;
            if (label === "Joint") {
                newValue = robotData.jointCurrent[`t${index + 1}`];
            } else {
                // Lấy giá trị từ positionCurrent tương ứng
                const positionKeys = ['x', 'y', 'z', 'rl', 'pt', 'yw'];
                newValue = robotData.positionCurrent[positionKeys[index]];
            }
    
            return {
                ...joint,
                input: newValue,
                value: newValue // Cập nhật cả value nếu cần
            };
        });
    
        setJointInput(newJointInput);
    };
    //#endregion

    //#region Right Content Area

    //#region Declaration variable right content
    const jointInputRead = [
        { label: 'J1', value: robotData.jointCurrent.t1 }, 
        { label: 'J2', value: robotData.jointCurrent.t2 }, 
        { label: 'J3', value: robotData.jointCurrent.t3 }, 
        { label: 'J4', value: robotData.jointCurrent.t4 }, 
        { label: 'J5', value: robotData.jointCurrent.t5 }, 
        { label: 'J6', value: robotData.jointCurrent.t6 }, 
    ];
    const initialJointInput = jointInputRead.map(joint => ({
    ...joint,
    input: joint.value
    }));

    const [JointInput, setJointInput] = useState(initialJointInput);
    const [currentUnitShow, setCurrentUnitShow] = useState(0);

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
        [[0, 180],[-200, 1000]],
        [[0, 180],[-900, 900]],
        [[0, 135],[0, 1450]],
        [[0, 180],[-180, 180]],
        [[0, 176],[-180, 180]],
        [[0, 359.99],[-180, 180]],
    ]

    const {
        value: stepsize,
        increase: IncreaseStepsize,
        decrease: DecreaseStepsize
      } = useCounter(1, 1, [0.5, 30]);
    
    const {
        value: duration,
        increase: IncreaseDuration,
        decrease: DecreaseDuration
    } = useCounter(300, 10, [170, 300]);
    
    // Tạo 6 counters riêng biệt cho 6 joint
    const jointCounters = [
        useCounter(jointInputRead[0].value, stepsize, LimitRangeRobot[0][currentUnitShow]), //LimitRangeRobot[1][currentUnitShow]
        useCounter(jointInputRead[1].value, stepsize, LimitRangeRobot[1][currentUnitShow]),
        useCounter(jointInputRead[2].value, stepsize, LimitRangeRobot[2][currentUnitShow]),
        useCounter(jointInputRead[3].value, stepsize, LimitRangeRobot[3][currentUnitShow]),
        useCounter(jointInputRead[4].value, stepsize, LimitRangeRobot[4][currentUnitShow]),
        useCounter(jointInputRead[5].value, stepsize, LimitRangeRobot[5][currentUnitShow]),
    ];

    // Cập nhật JointCounter khi các giá trị counter thay đổi
    useEffect(() => {
        const newJointInput = jointCounters.map((counter, index) => {
            const min = LimitRangeRobot[index][0][0];
            const max = LimitRangeRobot[index][0][1];

            let input_value = counter.value;

            if (input_value < min) input_value = min;
            else if (input_value > max) input_value = max;

            return {
                label: LabelShow[index][currentUnitShow],
                value: counter.value,
                input: input_value,
            };
        });

        setJointInput(newJointInput);
        sendJointUpdate(newJointInput);
    }, [jointCounters.map(counter => counter.value).join(',')]);

    //#endregion

    //#region Increase and Decrease JogMode
    const handleJointIncrement = (index) => {
        jointCounters[index].increase();
    };

    const handleJointDecrement = (index) => {
        jointCounters[index].decrease();
    };
    //#endregion

    //#region Popup
    const [showPopupGlobal, setShowPopupGlobal] = useState(false);

    const PopupWrapper = useMemo(() => {
        if (!showPopupGlobal) return null;

        const ClosePopup = () => {
            setShowPopupGlobal(false);
        }

        const { t1, t2, t3, t4, t5, t6 } = robotData.jointCurrent;
        let joint = [t1, t2, t3, t4, t5, t6];
        
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
          const {t1, t2, t3, t4, t5, t6} = robotData.jointCurrent;
          let joint = [t1, t2, t3, t4, t5, t6];
          
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

    const handleType = async (type) => {
        try {
            fetch(API_URL + "jog/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type
                })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        handleType("Work");
    }, []);

    const handleEMG = async () => {
        try {
            fetch(API_URL + "EMG/", {method: 'GET'});
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const sendJointUpdate = async (newJointInput) => {
        try {
            if(startWeb.current){
                startWeb.current = false;
                return;
            }
            const jointValues = newJointInput.map(joint => joint.value);
            const response = await fetch(API_URL + 'O0025/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    joint: jointValues,
                    jogMode: activeJogButton,
                    velocity: velocity*5/100,
                    acceleration: acceleration*5/100
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
            const response = await fetch(API_URL + 'O0022/', {
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

            const data = await response.json()
            if(!data.success){
                toast.error("Failed to move", {
                    style: {border: '1px solid red'}});
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAbort = async () => {
        try {
            fetch(API_URL + "O0023/", {
                method: 'GET'
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleMoveToHome = async () => {
        try {
            fetch(API_URL + "O0024/", {
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
                            <img src={ModelRobot} alt="Image Robot Arm" />
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
                                    onMouseDown={() => IncreaseVelocity()}
                                >
                                    V+
                                </button>
                                <button 
                                    className="btn-change" 
                                    onMouseDown={() => DecreaseVelocity()} 
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
                                        onMouseDown={() => IncreaseAcceleration()}
                                    >
                                        A+
                                    </button>
                                    <button 
                                        className="btn-change" 
                                        onMouseDown={() => DecreaseAcceleration()}
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
                            <div className={`joint-panel jog-true ${robotData.busy ? 'disabled' : ''}`}>
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
                                                    disabled={robotData.busy}
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
                                                    disabled={robotData.busy}
                                                />
                                                <div className="joint-value">                                                    
                                                    {activeMoveButton === "Joint"
                                                        ? robotData.jointCurrent[`t${index + 4}`]?.toFixed(2) + "°"
                                                        : Object.values(robotData.positionCurrent)[index + 3]?.toFixed(2) + "°"
                                                    }
                                                </div>
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
                                                    disabled={robotData.busy}
                                                > 
                                                    {LabelShow[index][currentUnitShow]}+ 
                                                </button>
                                                <button 
                                                    className="joint-btn"
                                                    onMouseDown={() => handleJointDecrement(index)}
                                                    disabled={robotData.busy}
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
                                                    disabled={robotData.busy}
                                                > 
                                                    {LabelShow[index+3][currentUnitShow]}+ 
                                                </button>
                                                <button 
                                                    className="joint-btn"
                                                    onMouseDown={() => handleJointDecrement(index + 3)}
                                                    disabled={robotData.busy}
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
                                        onMouseDown={() => IncreaseStepsize()}
                                        >
                                        S+
                                        </button>
                                        <button 
                                        className="btn-change" 
                                        onMouseDown={() => DecreaseStepsize()} 
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
                                        onMouseDown={() => IncreaseDuration()}
                                        >
                                        D+
                                        </button>
                                        <button 
                                        className="btn-change" 
                                        onMouseDown={() => DecreaseDuration()}
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
                                        onClick={() => handleReadActualPosition}
                                    >
                                        Read Actual Position
                                    </button>
                                    <button 
                                        className={`control-button-tall ${isJog ? '' : 'active'}`}
                                        onClick={() => {handleMove();}}
                                        disabled={robotData.busy}
                                    >
                                        Move
                                    </button>
                                </div>
                                )}
                            </motion.div>
                            
                            <div className="button-row">
                                <button 
                                    className="control-button"
                                    onClick={() => handleAbort()}
                                >
                                    Abort
                                </button>
                                <button 
                                    className="control-button"
                                    onClick={() => handleMoveToHome()}
                                    // disabled={robotData.busy}
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
                                    disabled={robotData.busy}
                                >
                                    Teach Position
                                </button>
                                <button 
                                    className="control-button small"
                                    onClick={() => navigate(-1)}
                                    disabled={robotData.busy}
                                >
                                    Back
                                </button>
                                <button 
                                    className="control-button"
                                    onClick={() => setShowPopupGlobal(true)}
                                    disabled={robotData.busy}
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