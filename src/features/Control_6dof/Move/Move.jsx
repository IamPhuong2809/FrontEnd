import React, { useState } from 'react';
import './Move.css';
import Menu from '@components/Control_6dof/Menu/Menu';
import HeaderControl from '@components/Control_6dof/Header/Header';

const Move = () => {
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
        { label: 'J1', value: 1.00, input: 0.00 },
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

    return (
        <div>
            <HeaderControl />
            <Menu />
            <div className="move-robot-container">
                {/* Top Control Bar */}
                {/* <div className="info-controls">
                    <div className="display-container">
                        <div className="tool-display">Tool: {Tool}</div>
                        <div className="work-display">Work: {WorkType}</div>
                    </div>
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
                    <div className="tool-buttons">
                        <button>HELP</button>
                        <button>EMERGENCY</button>
                    </div>
                </div> */}

                {/* Left Content Area */}
                <div className="left-content">
                    <div className="joint-panel">
                        <div className="left-panel">
                            {jointInputRead.slice(0, 3).map((joint, index) => (
                                <div className="joint-control-left" key={index}>
                                    <div className="joint-label">{joint.label}</div>
                                    <div>
                                        <input 
                                            type="text" 
                                            value={`${joint.input} °`} 
                                            className="joint-input"
                                            onChange={(e) => handleInputChange(e, index)} />
                                        <div className="joint-value">{joint.value}°</div>
                                    </div>
                                </div>    
                            ))}
                        </div>

                        {/* Right Panel: Hiển thị các khớp bên phải */}
                        <div className="right-panel">
                            {jointInputRead.slice(3, 6).map((joint, index) => (
                                <div className="joint-control-right" key={index}>
                                    <div className="joint-label">{joint.label}</div>
                                    <div>
                                        <input 
                                            type="text" 
                                            value={`${joint.input} °`} 
                                            className="joint-input"
                                            onChange={(e) => handleInputChange(e, index)} />
                                        <div className="joint-value">{joint.value}°</div>
                                    </div>
                                </div>    
                            ))}
                        </div>
                    </div>
                <div className="bottom-controls">
                    <div className="left-buttons">
                        <div className="jog-label">JOG</div>
                        <div>
                            <button className="control-btn">Work</button>
                            <button className="control-btn">Joint</button>
                            <button className="control-btn">Tool</button>
                        </div>
                    </div>
                    <div className="right-buttons">
                        <div className="move-label">MOVE</div>
                        <button className="control-btn">LIN</button>
                        <button className="control-btn active">JOINT</button>
                        <button className="control-btn">PTP</button>
                    </div>
                </div>

                {/* Bottom Control Bar */}

                <div className="center-buttons">
                    <button className="control-btn">Teach Position</button>
                    <button className="control-btn">Back</button>
                    <button className="control-btn">Position List</button>
                </div>
                </div>
                <div className='right-content'>
                    {/* Center Panel: Robot Visualization, Action Buttons & Settings */}
                <div className="center-panel">
                    <div className="axis-title">MOVE AXIS</div>
                    <div className="robot-visualization">
                    {/* Các nhãn khớp overlay đặt tương ứng */}
                    <div className="joint-label-overlay j5">J5</div>
                    <div className="joint-label-overlay j6">J6</div>
                    <div className="joint-label-overlay j4">J4</div>
                    <div className="joint-label-overlay j3">J3</div>
                    <div className="joint-label-overlay j2">J2</div>
                    <div className="joint-label-overlay j1">J1</div>
                    {/* Hình ảnh mô phỏng cánh tay robot */}
                    <div className="robot-arm">
                        <div className="robot-base"></div>
                        <div className="robot-arm-upper"></div>
                    </div>
                    </div>
                    <div className="action-buttons">
                    <button className="control-btn">Read Actual Position</button>
                    <button className="control-btn">Move</button>
                    <button className="control-btn">Abort</button>
                    <button className="control-btn">Move to Home</button>
                    </div>
                    <div className="settings-panel">
                    <div className="setting-label">Velocity</div>
                    <div className="setting-value">5 %</div>
                    <div className="setting-label">Acceleration</div>
                    <div className="setting-value">5 %</div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Move;
