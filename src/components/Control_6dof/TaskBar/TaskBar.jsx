import React, { useState, useEffect } from 'react';
import './TaskBar.css';
import { useRobotData } from '@components/Control_6dof/RobotData';
import { API_URL } from '@utils/config';

const TaskBar = () => {
    const { robotData } = useRobotData();
    const [isTransparent, setIsTransparent] = useState(true); // Ban đầu là transparent

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransparent(false); // Sau 50ms, bỏ transparent
        }, 100);

        return () => clearTimeout(timer); // Cleanup khi unmount
    }, []);

    const handleEMG = async () => {
        try {
            fetch(API_URL + "EMG/", {
                method: "GET",
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="top-section">
            {/* Left Controls */}
            <div className="top-section-left">
                <div className="left-content1">
                    <span className={`status-box ${isTransparent ? 'transparent' : (robotData.S ? 'On' : '')}`}>
                        S
                    </span>
                    <span className={`status-box ${isTransparent ? 'transparent' : (robotData.I ? 'On' : '')}`}>
                        I
                    </span>
                    <span className={`status-box ${isTransparent ? 'transparent' : (robotData.AUX ? 'On' : '')}`}>
                        AUX
                    </span>
                </div>

                <div className="left-content2">
                    <div>
                        <span>Tool: </span>
                        <span>{robotData.tool}</span>
                    </div>
                    <div>
                        <span>Work: </span>
                        <span>{robotData.work}</span>
                    </div>
                </div>

                <div className="left-content3">
                    <div className="item">
                        <span>Override</span>
                        <span>{robotData.override} %</span>
                    </div>
                    <button>...</button>
                </div>
            </div>

            {/* Right Section */}
            <div className="top-section-right">
                <button>HELP</button>
                <button
                    onClick={() => handleEMG()}
                >
                    EMERGENCY</button>
            </div>
        </div>
    );
};

export default TaskBar;
