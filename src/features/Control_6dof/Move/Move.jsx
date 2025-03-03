import React, { useState } from 'react';
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

    // Dữ liệu của các khớp (giá trị mẫu)
    const jointInputRead = [
        { label: 'J1', value: 1.00, input: 110.23 },
        { label: 'J2', value: -2.00, input: 0.00 },
        { label: 'J3', value: 3.00, input: 0.00 },
        { label: 'J4', value: -41.00, input: 0.00 },
        { label: 'J5', value: 51.00, input: 0.00 },
        { label: 'J6', value: 61.00, input: 0.00 },
    ];
    const [JointInput, setJointInput] = useState(jointInputRead);

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        const newJointInput = [...JointInput];
        newJointInput[index].input = value;
        setJointInput(newJointInput);
    };
    //#endregion

    //#region Right Content Area
    const [velocity, setVelocity] = useState(5);
    const [acceleration, setAcceleration] = useState(5);
    const handleIncrementVelocity = () => {
        setVelocity(prev => (prev < 100 ? prev + 1 : 100));
    };
    
    const handleDecrementVelocity = () => {
        setVelocity(prev => (prev > 0 ? prev - 1 : 0));
    };

    const handleIncrementAcceleration = () => {
        setAcceleration(prev => (prev < 100 ? prev + 1 : 100));
    };

    const handleDecrementAcceleration = () => {
        setAcceleration(prev => (prev > 0 ? prev - 1 : 0));
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
                    
                    <div className="joint-panel">
                        <div className="left-panel">
                            {JointInput.slice(0, 3).map((joint, index) => (
                                <div className="joint-control-left" key={index}>
                                    <div className="joint-label">{joint.label}</div>
                                    <div>
                                        <input 
                                            type="text" 
                                            value={joint.input}
                                            className="joint-input"
                                            onChange={(e) => handleInputChange(e, index)} />
                                        <div className="joint-value">{joint.value}°</div>
                                    </div>
                                </div>    
                            ))}
                        </div>

                        {/* Right Panel: Hiển thị các khớp bên phải */}
                        <div className="right-panel">
                            {JointInput.slice(3, 6).map((joint, index) => (
                                <div className="joint-control-right" key={index + 3}>
                                    <div className="joint-label">{joint.label}</div>
                                    <div>
                                        <input 
                                            type="text" 
                                            value={joint.input}
                                            className="joint-input"
                                            onChange={(e) => handleInputChange(e, index + 3)} />
                                        <div className="joint-value">{joint.value}°</div>

                                    </div>
                                </div>    
                            ))}
                        </div>
                    </div>
                    <div className="bottom-controls">
                        <div className="left-buttons">
                            <div className="jog-label">JOG</div>
                            <div className='jog-container'>
                                <button className="control-btn">Work</button>
                                <button className="control-btn">Joint</button>
                                <button className="control-btn">Tool</button>
                            </div>
                        </div>
                        <div className="right-buttons">
                            <div className="move-label">MOVE</div>
                            <div className='move-container'>
                                <button className="control-btn">LIN</button>
                                <button className="control-btn active">JOINT</button>
                                <button className="control-btn">PTP</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right content */}
                <div className='right-content'>
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
                                    <button className="btn-change" onClick={handleIncrementVelocity}>V+</button>
                                    <button className="btn-change" onClick={handleDecrementVelocity}>V-</button>
                                </div>
                            </div>
                            <div className='acceleration-container'>
                                <div>
                                <div className="setting-label">Acceleration</div>
                                <div className="setting-value">{acceleration} %</div>
                                </div>
                                <div>
                                    <button className="btn-change" onClick={handleIncrementAcceleration}>A+</button>
                                    <button className="btn-change" onClick={handleDecrementAcceleration}>A-</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button-control-panel">
                        <div className="button-row">
                            <button className="control-button">Read Actual Position</button>
                            <button className="control-button">Move</button>
                        </div>
                        
                        <div className="button-row">
                            <button className="control-button">Abort</button>
                            <button className="control-button">Move to Home</button>
                        </div>
                        
                        <div className="spacer"></div>
                        <div className="button-row">
                            <button className="control-button">Teach Position</button>
                            <button className="control-button small">Back</button>
                            <button className="control-button">Position List</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Move;
