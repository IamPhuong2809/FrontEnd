import React, { useState, useMemo, useEffect, act } from 'react';
import HeaderControl from "@components/Header/Header";
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar';
import PopupChoice from './PopupChoice';
import { API_URL } from '@utils/config';
import './AssignTask.css'

const AssignTask = () => {

    const socket = new WebSocket(API_URL +"status");

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Update from server:", data);
    };

    const [actions, setActions] = useState([]);

    const addAction = (newAction) => {
        setActions([...actions, newAction]);
    };

    const removeAction = (index) => {
        const updatedActions = [...actions];
        updatedActions.splice(index, 1);
        setActions(updatedActions);
    };

    const renderActionText = (action) => {
        console.log(actions)
        if (action.type === 1) {
            return `Mobile - Name Pos: ${action.data.pos} - Map: ${action.data.map} - Site: ${action.data.site}`;
        } else if (action.type === 2) {
            return `Aruco - ID: ${action.data.id} - Type Grip: ${action.data.grip}`;
        } else {
            return "Dont know type action";
        }
    };

    

    const [ showPopupChoice, setShowPopupChoice] = useState(false);

    return (
        <div>
            <HeaderControl />
            <div className="taskbar-robot-container">
                <TaskBar />
                <div className="control-buttons">
                    <button className="add-action-button" onClick={() => setShowPopupChoice(true)}>
                        + Add Action
                    </button>
                    <button className="run-button">▶ Run</button>
                    <button className="stop-button">⏹ Stop</button>
                    <button className="home-button">🏠 Home</button>
                </div>
                <div className="action-list-container">
                    <ul className="action-list">
                        {actions.map((action, index) => (
                            <li key={index} className="action-item">
                                <span>{renderActionText(action)}</span>
                                <button className="delete-button" onClick={() => removeAction(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showPopupChoice && (
                <div className="popup-overlay-form">
                    <div className="popup-content-form">
                            <PopupChoice
                                ClosePopup={() => setShowPopupChoice(false)}
                                AddAction={(action) => addAction(action)}
                            />
                    </div>
                </div>
                )}
        </div>
    )
}

export default AssignTask;