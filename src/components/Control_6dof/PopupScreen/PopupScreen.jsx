import React, { useMemo, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './PopupScreen.css';
import { API_URL } from '@utils/config';


const PopupScreen = ({ selectedPoint, onClose, robotData }) => {
  // useMemo luôn gọi, bất kể selectedPoint có null hay không
  const status = useMemo(() => {
    const { busy, Power, error, abort } = robotData || {};
    return { busy, Power, error, abort };
  }, [robotData?.busy, robotData?.Power, robotData?.error, robotData?.abort]);

  const [desiredPosition, setDesiredPosition] = useState([
    { label: 'X', value: '' },
    { label: 'Y', value: '' },
    { label: 'Z', value: '' },
    { label: 'RX', value: '' },
    { label: 'RY', value: '' },
    { label: 'RZ', value: '' },
    { label: 'FIG', value: '' }
  ]);
  

  const fetchLoadData = async () => {
      try {
          const response = await fetch(API_URL + "global/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({id:selectedPoint.id, type:"data"})
          });
          const data = await response.json();
          const updatedPosition = [
            { label: 'X', value: `${parseFloat(data.x).toFixed(2)}mm` },
            { label: 'Y', value: `${parseFloat(data.y).toFixed(2)}mm` },
            { label: 'Z', value: `${parseFloat(data.z).toFixed(2)}mm` },
            { label: 'RX', value: `${parseFloat(data.roll).toFixed(2)}°` },
            { label: 'RY', value: `${parseFloat(data.pitch).toFixed(2)}°` },
            { label: 'RZ', value: `${parseFloat(data.yaw).toFixed(2)}°` },
            { label: 'FIG', value: `${data.figure}` }
          ];
          setDesiredPosition(updatedPosition);
      } catch (error) {
          console.error("Error:", error);
      }
  };

  useEffect(() => {
      fetchLoadData();
  }, []); 


  if (!selectedPoint) return null;

  const handleMove = async () => {
    try {
      const response = await fetch(API_URL + "O0014/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({id:selectedPoint.id})
      });
      const data = await response.json()
      if(data.success){
        toast.success("Initializing Movement", {
          style: {border: '1px solid green'}});
      } else {
        toast.error("Failed to move", {
          style: {border: '1px solid red'}});
      }
      } catch (error) {
          console.error("Error:", error);
      }
    }
    
    const handleAbort = async () => {
      try {
        const response = await fetch(API_URL + "O0015/", {
          method: "GET",
        });
    
        const data = await response.json();
        if (data.success) { 
          toast.error("Movement Aborted!", {
            style: { border: "1px solid green" },
          });
        } else {
          toast.error("Abort failed", {
            style: { border: "1px solid red" },
          });
        }
      } catch (error) {
        console.error("Abort Error:", error);
      }
    };

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
              <button className="move-button" onClick={() => handleMove()}>MOVE TO POINT</button>
              <button className="abort-button" onClick={() => handleAbort()}>Abort Movement</button>
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
