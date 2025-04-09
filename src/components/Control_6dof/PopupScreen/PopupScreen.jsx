import React, { useMemo } from 'react';
import './PopupScreen.css';
const url = "http://127.0.0.1:8000/api/"


const PopupScreen = ({ selectedPoint, onClose, robotData }) => {
  // useMemo luôn gọi, bất kể selectedPoint có null hay không
  const status = useMemo(() => {
    const { busy, Power, error, abort } = robotData || {};
    return { busy, Power, error, abort };
  }, [robotData?.busy, robotData?.Power, robotData?.error, robotData?.abort]);

  const desiredPosition = useMemo(() => [
    { label: 'X', value: '-57.54mm' },
    { label: 'Y', value: '210.00mm' },
    { label: 'Z', value: '463.14mm' },
    { label: 'RX', value: '180.00°' },
    { label: 'RY', value: '20.00°' },
    { label: 'RZ', value: '-81.49°' },
    { label: 'FIG', value: '5' }
  ], []);

  if (!selectedPoint) return null;

  const handleMove = () => fetch(url + "O0014/", { method: 'GET' });
  const handleAbort = () => fetch(url + "O0015/", { method: 'GET' });

  return (
    <div className='point-detail-position'>
      <div className="point-detail-header">
        <div className="point-detail-title">
          [Point {selectedPoint.id}] "{selectedPoint.name}"
        </div>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="move-to-point-container">
        <div className="dialog-header">
          <span>Move to point</span>
        </div>
        <div className="note-header">
          NOTE: Do you want to move to the point [{selectedPoint.id}] "{selectedPoint.name}"?
        </div>

        <div className="dialog-content">
          <div className="note-section">
            <div className="option-spans">
              <div className="option-span-top">
                <span className={`option-span busy ${status.busy ? 'on' : ''}`}>BUSY</span>
                <span className={`option-span active ${status.Power ? 'on' : ''}`}>ACTIVE</span>
                <span className={`option-span error ${status.error ? 'on' : ''}`}>ERROR</span>
              </div>
              <div className="option-span-bottom">
                <span className={`option-span done ${!status.busy ? 'on' : ''}`}>DONE</span>
                <span className={`option-span abort ${status.abort ? 'on' : ''}`}>ABORTED</span>
              </div>
            </div>
            <div className="error-text">Error Text:</div>
            <div className="action-buttons">
              <button className="move-button" onClick={handleMove}>MOVE TO POINT</button>
              <button className="abort-button" onClick={handleAbort}>Abort Movement</button>
            </div>
          </div>

          <div className="position-section-desired">
            <div className="position-header">Desired Position:</div>
            <div className="position-data">
              {desiredPosition.map(item => (
                <div className="position-row" key={item.label}>
                  <div className="position-label">{item.label}</div>
                  <div className="position-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PopupScreen);
