import React, { useState, useEffect } from 'react';
import './TaskBar.css';
import { useRobotData } from '@components/Control_6dof/RobotData';

const TaskBar = () => {
    const { robotData } = useRobotData();
    const [isTransparent, setIsTransparent] = useState(true); // Ban đầu là transparent

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransparent(false); // Sau 50ms, bỏ transparent
        }, 100);

        return () => clearTimeout(timer); // Cleanup khi unmount
    }, []);

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
            </div>

            {/* Right Section */}
            <div className="top-section-right">
                <button>HELP</button>
                <button>EMERGENCY</button>
            </div>
        </div>
    );
};

export default TaskBar;
