import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import './Move.css';
import Menu from '@components/Control_6dof/Menu/Menu';
import HeaderControl from '@components/Control_6dof/Header/Header';

const Move = () => {
    //#region Left Content Area
    // Các state cho thông số hiển thị
    const [Tool, setTool] = useState(1);
    const [statuses, setStatuses] = useState([
        { label: 'S', isOn: false },
        { label: 'I', isOn: false },
        { label: 'AUX', isOn: false },
    ]);
    const [Override, setOverride] = useState(5);
    const [WorkType, setWorkType] = useState(2);

    //#region Velocity and Acceleration
    const intervalRefVelocity = useRef(null);
    const intervalRefAcceleration = useRef(null);
    const [velocity, setVelocity] = useState(5);
    const [acceleration, setAcceleration] = useState(5);

    const changeVelocity = (type) => {
        setVelocity((prevVelocity) => {
            let newVelocity = type === "increase" ? prevVelocity + 1 : prevVelocity - 1;
            return Math.max(0, Math.min(100, newVelocity)); // Giới hạn từ 0 đến 100
        });
    };

    const handleMouseDownVelocity = (type) => {
        changeVelocity(type);
        intervalRefVelocity.current = setInterval(() => {
            changeVelocity(type);
        }, 150);
    };

    const handleMouseUpVelocity = () => {
        clearInterval(intervalRefVelocity.current);
    };

    const changeAcceleration = (type) => {
        setAcceleration((prevAcceleration) => {
            let newAcceleration = type === "increase" ? prevAcceleration + 1 : prevAcceleration - 1;
            return Math.max(0, Math.min(100, newAcceleration)); // Giới hạn từ 0 đến 100
        });
    };
    
    const handleMouseDownAcceleration = (type) => {
        changeAcceleration(type);
        intervalRefAcceleration.current = setInterval(() => {
            changeAcceleration(type);
        }, 150); 
    };
    
    const handleMouseUpAcceleration = () => {
        if (intervalRefAcceleration.current) {
            clearInterval(intervalRefAcceleration.current);
            intervalRefAcceleration.current = null;
        }
    };
    //#endregion

    const[isJog, setIsJog] = useState(true);
    const [activeJogButton, setActiveJogButton] = useState('Work');
    const [activeMoveButton, setActiveMoveButton] = useState(null);

    const handleJogButtonClick = (label) => {
        setActiveJogButton(label);
        setActiveMoveButton(null);
        setIsJog(true);
        if(label === 'Joint')
            setIndexShow(0);
        else
            setIndexShow(1);
    };

    const handleMoveButtonClick = (label) => {
        setActiveMoveButton(label);
        setActiveJogButton(null);
        setIsJog(false);
        if(label === 'Joint')
            setIndexShow(0);
        else
            setIndexShow(1);
    };
    //#endregion

    //#region Right Content Area
    // Dữ liệu của các khớp (giá trị mẫu)
    const jointInputRead = [
        { label: 'J1', value: 1.00 }, 
        { label: 'J2', value: -2.00 }, 
        { label: 'J3', value: 3.00 }, 
        { label: 'J4', value: -41.00 }, 
        { label: 'J5', value: 51.00 }, 
        { label: 'J6', value: 61.00 }, 
    ];
    
      
    const initialJointInput = jointInputRead.map(joint => ({
    ...joint,
    input: joint.value
    }));

    const [JointInput, setJointInput] = useState(initialJointInput);
    const [indexShow, setIndexShow] = useState(1);

    const LabelShow = [
        ['J1', 'X',],
        ['J2', 'Y'],
        ['J3', 'Z'],
        ['J4', 'RX'],
        ['J5', 'RY'],
        ['J6', 'RZ'],
    ];

    const handleInputChange = (e, index) => {
        const value = parseFloat(e.target.value);
        const newJointInput = [...JointInput];
        newJointInput[index].input = value;
        setJointInput(newJointInput);
    };

    const[isBusy, setIsBusy] = useState(false);
    const[isActive, setIsActive] = useState(false);
    const[isError, setIsError] = useState(false);

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
                                {statuses.map((status, index) => (
                                <div key={index}>
                                    <span className={`indicator ${status.isOn ? 'green' : ''}`}>
                                        {status.label}
                                    </span>
                                </div>
                                ))}
                            </div>
                            <div className="override">Override: {Override} %</div>
                        </div>
                        <div className="display-container">
                            <div className="tool-display">Tool: {Tool}</div>
                            <div className="work-display">Work: {WorkType}</div>
                        </div>
                        <div className="tool-buttons">
                            <button>HELP</button>
                            <button>EMERGENCY</button>
                        </div>
                    </div>
                    <div className="axis-title">MOVE AXIS</div>
                    <div className="robot-visualization">
                        <div className="robot-arm">
                            <div className="robot-base"></div>
                            <div className="robot-arm-upper"></div>
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
                                        onMouseDown={() => handleMouseDownVelocity("increase")}
                                        onMouseUp={handleMouseUpVelocity}
                                        onMouseLeave={handleMouseUpVelocity}
                                    >
                                        V+
                                    </button>
                                    <button
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownVelocity("decrease")}
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
                                        onMouseDown={() => handleMouseDownAcceleration("increase")}
                                        onMouseUp={handleMouseUpAcceleration}
                                        onMouseLeave={handleMouseUpAcceleration}
                                    >
                                        A+
                                    </button>
                                    <button 
                                        className="btn-change" 
                                        onMouseDown={() => handleMouseDownAcceleration("decrease")}
                                        onMouseUp={handleMouseUpAcceleration}
                                        onMouseLeave={handleMouseUpAcceleration}
                                    >
                                        A-
                                    </button>
                                </div>
                            </div>
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
                        transition={{ duration: 0.4 }}
                        >
                            <div className="joint-panel jog-true">
                                {/* Left panel cũ */}
                                <div className="left-panel">
                                    {JointInput.slice(0, 3).map((joint, index) => (
                                        <div className="joint-control-left" key={index}>
                                            <div className="joint-label">{joint.label}</div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={joint.input.toFixed(2)}
                                                    className="joint-input"
                                                    onChange={(e) => handleInputChange(e, index)}
                                                />
                                                <div className="joint-value">{joint.value.toFixed(2)}°</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Right panel cũ */}
                                <div className="right-panel">
                                    {JointInput.slice(3, 6).map((joint, index) => (
                                        <div className="joint-control-right" key={index + 3}>
                                            <div className="joint-label">{joint.label}</div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={joint.input.toFixed(2)}
                                                    className="joint-input"
                                                    onChange={(e) => handleInputChange(e, index + 3)}
                                                />
                                                <div className="joint-value">{joint.value.toFixed(2)}°</div>
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
                                                <button className="joint-btn"> {joint.label}+ </button>
                                                <button className="joint-btn"> {joint.label}- </button>
                                            </div>
                                                <div className="joint-value">{joint.value.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="right-panel">
                                    {JointInput.slice(3, 6).map((joint, index) => (
                                        <div className="joint-control-right" key={index + 3}>
                                            <div className="joint-btn-container">
                                                <button className="joint-btn"> {joint.label}+ </button>
                                                <button className="joint-btn"> {joint.label}- </button>
                                            </div>
                                            <div className="joint-value">{joint.value.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div className="button-control-panel">
                        <div className='button-top'>
                            <div className="button-row">
                                <button className={`control-button-tall ${isJog ? '' : 'active'}`}>
                                    Read Actual Position
                                </button>
                                <button className={`control-button-tall ${isJog ? '' : 'active'}`}>
                                    Move
                                </button>
                            </div>
                            
                            <div className="button-row">
                                <button className="control-button">Abort</button>
                                <button className="control-button">Move to Home</button>
                            </div>
                        </div>
                        <div className="button-bottom">
                            <div className="info-row">
                                <span className={`info-span ${isBusy ? 'busy' : ''}`}>BUSY</span>
                                <span className={`info-span small ${isActive ? 'active' : ''}`}>ACTIVE</span>
                                <span className={`info-span ${isError ? 'error' : ''}`}>ERROR</span>
                            </div>
                            <div className="button-row">
                                <button className="control-button">Teach Position</button>
                                <button className="control-button small">Back</button>
                                <button className="control-button">Position List</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Move;
