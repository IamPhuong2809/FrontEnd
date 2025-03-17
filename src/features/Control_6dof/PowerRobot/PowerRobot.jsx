import React, { useState } from 'react'
import HeaderControl from '@components/Control_6dof/Header/Header'
import './PowerRobot.css'
import Table from '@components/Control_6dof/Table/Table'
import Menu from '@components/Control_6dof/Menu/Menu'
import { handleInputChange } from '@utils/inputValidation';

const url = "http://127.0.0.1:8000/api/"


const PowerRobot = () => {
    const [showModal, setShowModal] = useState(false);
    const [powerRobot, setPowerRobot] = useState(false);
    const LimitRangeCartesian = [
        [0, 400], [0, 400], [0, 400], [0, 180], [0, 180], [0, 180]
    ];


    // Khai báo cho từng card
    //#region Card Power
    //#endregion

    //#region Card Axis
    const axisPositions = [
        { joint: "J1", value: "-52.67°" },
        { joint: "J2", value: "+10.44°" },
        { joint: "J3", value: "+95.79°" },
        { joint: "J4", value: "+0.00°" },
        { joint: "J5", value: "+27.29°" },
        { joint: "J6", value: "+8.01°" }
      ];
    //#endregion

    //#region Card Cartesian
    const cartesianPositions = [
        { label: "X", value: "+170.08mm" },
        { label: "Y", value: "-223.05mm" },
        { label: "Z", value: "+433.70mm" },
        { label: "Roll", value: "+177.64°" },
        { label: "Pitch", value: "+16.31°" },
        { label: "Yaw", value: "+118.98°" }
      ];
    //#endregion

    //#region Card Error
    const errors = [
        { id: 1, code: "0000" },
        { id: 2, code: "0000" },
        { id: 3, code: "0000" },
        { id: 4, code: "0000" }
      ];
    //#endregion

    //#region Card Parameter
    //#endregion

    //#region Card Home Position
    const defaultPosition = [
        { label: "X", input: 170.09 },
        { label: "Y", input: -223.05 },
        { label: "Z", input: 432.71 },
        { label: "Rl", input: 177.64 },
        { label: "Pt", input: 16.31 },
        { label: "Yw", input: 118.98 }
    ];

    const [homePosition, setHomePosition] = useState(defaultPosition);

    const handleResetToDefault = () => {
        setHomePosition(defaultPosition);
    };
    //#endregion
    
    //#region Modal
  // Mảng chứa các vị trí đã lưu (có thể lấy từ API hoặc state management)
  const savedPositions = [
    {
      id: 1,
      name: "Home Position 1",
      coordinates: {
        X: 170.09, Y: -223.05, Z: 432.71,
        Rl: 177.64, Pt: 16.31, Yw: 118.98
      }
    },
    {
      id: 2,
      name: "Home Position 2",
      coordinates: {
        X: 180.00, Y: -220.00, Z: 430.00,
        Rl: 175.00, Pt: 15.00, Yw: 120.00
      }
    }
  ];

  const handlePositionClick = () => {
    setShowModal(true);
  };

  // Thêm Modal component vào phần render
  const Modal = () => {
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <Table 
                    nameTitle="List Home Position"
                    savedPositions={savedPositions}
                    setShowModal={setShowModal}
                    handleUsePosition={handleUsePosition}
                    handleDeletePosition={handleDeletePosition}
                />
            </div>
        </div>
    );
  };
  //#endregion Modals

    //#region Backend

    const handlePowerOff = async () => {
        try {
            const response = await fetch(url + "O0000/", {
                method: 'GET',
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePowerOn = async () => {
        try {
            const response = await fetch(url + "O0001/", {
                method: 'GET',
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePowerReset = async () => {
        try {
            const response = await fetch(url + "O0002/", {
                method: 'GET',
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePowerAbort = async () => {
        try {
            const response = await fetch(url + "O0003/", {
                method: 'GET',
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleHomePositionSave = async (position) => {
        try {
            const response = await fetch(url + "O0010/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(homePosition),
            });
            // const data = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUsePosition = async (id) => {
        try {
            const response = await fetch(url + "O0011/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            const data = await response.json();
            // setHomePosition(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeletePosition = async (id) => {
        try {
            const response = await fetch(url + "O0012/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            const data = await response.json();
            // setHomePosition(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [isError, setIsError] = useState(false);
    const [isMove, setIsMove] = useState(false);
    const [isEE, setIsEE] = useState(false);
    

    //#endregion 


  return (
    <div className="power-robot-container">
      <HeaderControl />
      <Menu />
        <div className='control-panel'>
          {/* Cột 1 */}
          <div className='left-column'>
            <div className='control-card power-section'>
              <div className='power-button'>
                <span>Robot Power</span>
                <div className='button-start'>
                    <button 
                        className={`btn-off ${powerRobot ? '' : 'active'}`} 
                        onClick={() => {
                            setPowerRobot(false);
                            handlePowerOff();
                        }}
                    >
                        Off
                    </button>
                    <button 
                        className={`btn-on ${powerRobot ? 'active' : ''}`} 
                        onClick={() => {
                            setPowerRobot(true);
                            handlePowerOn();
                        }}
                    >
                        On
                    </button>
                </div>
              </div>
              <div className='status-list'>
                <div className={`status-item  ${powerRobot ? 'active' : ''}`}>Powered</div>
                <div className={`status-item  ${isError ? 'active' : ''}`}>No Error</div>
                <div className={`status-item  ${isMove ? 'active' : ''}`}>Robot is ready to move</div>
                <div className={`status-item  ${isEE ? 'active' : ''}`}>End-Effector ON</div>
                <button className='btn-reset' onClick={handlePowerReset}>Reset</button>
                <button className='btn-abort' onClick={handlePowerAbort}>Abort</button>
              </div>
            </div>
            <div className='control-card error-section'>
              <h3>Error IDs</h3>
              <div className='error-list'>
                {errors.map((error) => (
                    <div className='error-row' key={error.id}>
                        <span>Error ID {error.id}</span>
                        <span>{error.code}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột 2 và 3 */}
          <div className='right-columns'>
            <div className='control-card position-section'>
              <h3>Cartesian Position</h3>
              <div className='position-display'>
                {cartesianPositions.map((pos, index) => (
                    <div className='position-row' key={index}>
                        <span>{pos.label}</span>
                        <span>{pos.value}</span>
                    </div>
                ))}
              </div>
            </div>
            <div className='control-card axis-section'>
              <h3>Axis Position</h3>
              <div className='axis-display'>
                {axisPositions.map((axis, index) => (
                    <div className="axis-row" key={index}>
                        <span>{axis.joint}</span>
                        <span>{axis.value}</span>
                    </div>
                ))}
              </div>
            </div>
            <div className='control-card parameters-section'>
              <h3>Parameters</h3>
              <div className='parameters-list'>
                <div className='parameter-row'>
                  <span>Data-time</span>
                  <span>Thu, 00-00-0000, 00:00:00</span>
                </div>
                <div className='parameter-row'>
                  <span>Power Consumption</span>
                  <span>0.00W</span>
                </div>
                <div className='parameter-row'>
                  <span>SSH Speed</span>
                  <span>0.00Mbps</span>
                </div>
                <div className='parameter-row'>
                  <span>IP Address robot controller</span>
                  <span>169. 147. 100 .220</span>
                </div>
              </div>
            </div>

            <div className='control-card home-position-section'>
                <h3>Home Position</h3>
                <div className="home-position-grid">
                    <div className='position-group-container'>
                        {homePosition.map((axis, index) => (
                            <div className="position-group" key={index}>
                                <div className="position-label">{axis.label}</div>
                                <input
                                    type="text"
                                    name = {axis}
                                    value={axis.input}
                                    onChange={(e) => handleInputChange(e, index, homePosition, setHomePosition, LimitRangeCartesian[index])}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="home-position-actions">
                        <button className="btn-default" onClick={handleResetToDefault}>
                            DEFAULT
                        </button>
                        <button className="btn-save" onClick={handleHomePositionSave}>
                            SAVE
                        </button>
                    </div>
                </div>
                <div className="home-list">
                    <div
                    className="home-list-item"
                    onClick={() => handlePositionClick()}
                    >
                    <span>List home position</span>
                    <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>        
      <Modal />
    </div>
  )
}

export default PowerRobot