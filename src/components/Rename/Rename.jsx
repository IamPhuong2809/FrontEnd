import React, { useState } from "react";
import "./Rename.css";

const Rename = ({ initialName = "", title = "Rename", onCancel, onConfirm }) => {
  const [newName, setNewName] = useState(initialName);

  return (
    <div className="rename-container">
      <div className="rename-modal">
        <h3 className="rename-title">{title}</h3>
        <div className="rename-input-group">
          <input
            type="text"
            className="rename-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter name"
            autoFocus
          />
        </div>
        <div className="rename-buttons">
          <button className="rename-button cancel" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="rename-button confirm" 
            onClick={() => onConfirm(newName)}
            disabled={!newName.trim()}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rename;