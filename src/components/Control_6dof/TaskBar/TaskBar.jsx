import React, { useState } from 'react';
import './TaskBar.css';

const TaskBar = () => {

    //#region Top Section
    // Sử dụng một mảng state để quản lý trạng thái của 3 span
    const [statuses, setStatuses] = useState([
        { label: 'S', isOn: false },
        { label: 'I', isOn: false },
        { label: 'AUX', isOn: false },
      ]);

    const [toolNumber, setToolNumber] = useState('0');
    const [workNumber, setWorkNumber] = useState('0');
  //#endregion Top Section


  return (
    <div className="top-section">
        {/* Left Controls */}
        <div className="top-section-left">
            <div className="left-content1">
                {statuses.map((status, index) => (
                    <div key={index}>
                        <span className={`status-box ${status.isOn ? 'On' : ''}`}>
                            {status.label}
                        </span>
                        </div>
                    ))}
            </div>

            <div className="left-content2">
                <div>
                    <span>Tool: </span>
                    <span>{toolNumber}</span>
                </div>
                <div>
                    <span>Work: </span>
                    <span>{workNumber}</span>
                </div>
            </div>

            <div className="left-content3">
                <div className="item">
                    <span>Override</span>
                    <span>5 %</span>
                </div>
                <button>...</button>
            </div>
        </div>

        {/* Right Section */}
        <div className="top-section-right">
            <button>HELP</button>
            <button>EMERGENCY</button>
        </div>
    </div>
  )
}

export default TaskBar
