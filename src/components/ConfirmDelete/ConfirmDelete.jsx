import React, { useEffect, useState } from 'react';
import './ConfirmDelete.css';

const ConfirmDelete = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName = 'all items',
  delaySeconds = 0 
}) => {
  const [countdown, setCountdown] = useState(delaySeconds);
  const [canConfirm, setCanConfirm] = useState(delaySeconds === 0);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(delaySeconds);
    setCanConfirm(delaySeconds === 0);

    if (delaySeconds > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanConfirm(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, delaySeconds]);

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
            disabled={!canConfirm}
          >
            {canConfirm ? 'Delete' : `Wait ${countdown}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
