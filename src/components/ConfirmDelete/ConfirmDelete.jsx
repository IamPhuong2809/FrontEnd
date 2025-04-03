import React from 'react';
import './ConfirmDelete.css';

const ConfirmDelete = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName = 'this item' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-delete-overlay">
      <div className="confirm-delete-dialog">
        <div className="confirm-delete-header">
          <h3>Confirm Delete</h3>
        </div>
        <div className="confirm-delete-content">
          <p>Are you sure you want to delete <strong>"{itemName}"</strong>?</p>
          <p>This action cannot be undone.</p>
        </div>
        <div className="confirm-delete-actions">
          <button 
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="delete-button"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;