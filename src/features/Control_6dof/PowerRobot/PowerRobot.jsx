import React, { useState, useEffect, useMemo, useRef } from 'react'
import HeaderControl from '@components/Header/Header'
import './PowerRobot.css'
import Table from '@components/Control_6dof/Table/Table'
import Loading from '@components/Loading/Loading'
import Menu from '@components/Control_6dof/Menu/Menu'
import { handleInputChange } from '@utils/inputValidation';
import { useRobotData } from '@components/Control_6dof/RobotData'
import { API_URL } from '@utils/config';
import { use } from 'react'

const PowerRobot = () => {
    const { robotData} = useRobotData();
    const [showModal, setShowModal] = useState(false);
    const [powerRobot, setPowerRobot] = useState(false);
    const LimitRangeCartesian = [
        [0, 400], [0, 400], [0, 400], [0, 180], [0, 180], [0, 180]
    ];
    // Khai báo cho từng card
    //#region Card Power
    useEffect(() =>{
      setPowerRobot(robotData["S"])
    }, [robotData["S"]])
    //#endregion

    //#region Card Axis
    const axisPositions = [
        { joint: "J1", value: `${robotData.jointCurrent.t1.toFixed(2)}°`},
        { joint: "J2", value: `${robotData.jointCurrent.t2.toFixed(2)}°`},
        { joint: "J3", value: `${robotData.jointCurrent.t3.toFixed(2)}°`},
        { joint: "J4", value: `${robotData.jointCurrent.t4.toFixed(2)}°`},
        { joint: "J5", value: `${robotData.jointCurrent.t5.toFixed(2)}°`},
        { joint: "J6", value: `${robotData.jointCurrent.t6.toFixed(2)}°`}
      ];
    //#endregion

    //#region Card Cartesian
    const cartesianPositions = [
      { label: "X", value: `${robotData.positionCurrent.x.toFixed(2)}mm` },
      { label: "Y", value: `${robotData.positionCurrent.y.toFixed(2)}mm` },
      { label: "Z", value: `${robotData.positionCurrent.z.toFixed(2)}mm` },
      { label: "Roll", value: `${robotData.positionCurrent.rl.toFixed(2)}°` },
      { label: "Pitch", value: `${robotData.positionCurrent.pt.toFixed(2)}°` },
      { label: "Yaw", value: `${robotData.positionCurrent.yw.toFixed(2)}°` }
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
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000); // Cập nhật mỗi giây
  
      return () => clearInterval(interval); // Cleanup interval khi component unmount
    }, []);

    const formatDateTime = (date) => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayOfWeek = days[date.getDay()]; // Lấy thứ (Sun, Mon, ...)
      
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() trả về từ 0-11
      const year = date.getFullYear();
  
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
  
      return `${dayOfWeek}, ${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
    };
    //#endregion

    //#region Card Home Position
    const defaultPosition = [
      { label: "T1", input: 90.0 },
      { label: "T2", input: 90.0 },
      { label: "T3", input: 45.0 },
      { label: "T4", input: 90.0 },
      { label: "T5", input: 90.0 },
      { label: "T6", input: 70.0 }
    ];
    const updatedPositions = useRef([]);

    const [homePosition, setHomePosition] = useState(defaultPosition);
    const [loading, setLoading] = useState(true); 

    const fetchLoadData = async () => {
      try {
          const response = await fetch(API_URL + "O0004/", {
              method: "POST",
          });
          const data = await response.json();  
          setHomePosition([
            { label: "T1", input: parseFloat(data[0].t1) },
            { label: "T2", input: parseFloat(data[0].t2) },
            { label: "T3", input: parseFloat(data[0].t3) },
            { label: "T4", input: parseFloat(data[0].t4) },
            { label: "T5", input: parseFloat(data[0].t5) },
            { label: "T6", input: parseFloat(data[0].t6) }
          ]);
          updatedPositions.current = data.map(item => ({
            id: item.id,
            name: `Home Position ${item.id}`,  // Tên tự động theo ID
            coordinates: {
              T1: item.t1,
              T2: item.t2,
              T3: item.t3,
              T4: item.t4,
              T5: item.t5,
              T6: item.t6
            },
          }));
      } 
      catch (error) {
          console.error('Error:', error);
      }
      finally{
          setLoading(false);
      }
    };

    useEffect(() =>{
      fetchLoadData()
    }, [])

    const handleResetToDefault = () => {
        setHomePosition(defaultPosition);
    };
    //#endregion

    //#region Backend

    const handlePowerOff = async () => {
        try {
            fetch(API_URL + "O0000/", {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePowerOn = async () => {
        try {
            fetch(API_URL + "O0001/", {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePowerReset = async () => {
        try {
            fetch(API_URL + "O0002/", {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePowerAbort = async () => {
        try {
            fetch(API_URL + "O0003/", {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleHomePositionSave = async () => {
        try {
            const homeInputs = homePosition.map(homeInput => parseFloat(homeInput.input));
            fetch(API_URL + "O0010/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(homeInputs),
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUsePosition = async (id) => {
        try {
            const response = await fetch(API_URL + "O0011/", {
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
            const response = await fetch(API_URL + "O0012/", {
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
    //#endregion 

    //#region Modal

    const handlePositionClick = () => {
      setShowModal(true);
    };

    // Thêm Modal component vào phần render
    const Modal = useMemo(() => {
      if (!showModal) return null;

      return (
          <div className="modal-overlay">
              <div className="modal-content">
                  <Table 
                      nameTitle="List Home Position"
                      savedPositions={updatedPositions.current}
                      setShowModal={setShowModal}
                      handleUsePosition={handleUsePosition}
                      handleDeletePosition={handleDeletePosition}
                  />
              </div>
          </div>
      );
    }, [showModal]);
    //#endregion Modals

  if (loading) {
      return <Loading/>;
    }

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
                <div className={`status-item  ${robotData.Power ? 'active' : ''}`}>
                  {robotData.Power ? 'Powered' : 'No Power'}
                </div>
                <div className={`status-item  ${robotData.error  ? '' : 'active'}`}>
                  {robotData.error ? 'Please check error id' : 'Do not have error'}
                </div>
                <div className={`status-item  ${!robotData.busy ? 'active' : ''}`}>
                  {robotData.busy ? 'Robot is busy' : 'Robot is ready to move'}  
                </div>
                <div className={`status-item  ${robotData.ee ? 'active' : ''}`}>End-Effector ON</div>
                <button className='btn-reset' onClick={handlePowerReset}>Reset Error</button>
                <button className='btn-abort' onClick={handlePowerAbort}>Home</button>
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
                  <span>{formatDateTime(currentTime)}</span>
                </div>
                <div className='parameter-row'>
                  <span>Power Consumption</span>
                  <span>0.00W</span>
                </div>
                <div className='parameter-row'>
                  <span>SSH Speed</span>
                  <span>15Mbps</span>
                </div>
                <div className='parameter-row'>
                  <span>IP Address robot controller</span>
                  <span>192.168.5.10</span>
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
                                    readOnly={true}
                                    name = {axis.label}
                                    value={axis.input}
                                    // onChange={(e) => handleInputChange(e, index, homePosition, setHomePosition, LimitRangeCartesian[index])}
                                />
                            </div>
                        ))}
                    </div>
                    {/* <div className="home-position-actions">
                        <button className="btn-default" onClick={handleResetToDefault}>
                            DEFAULT
                        </button>
                        <button className="btn-save" onClick={handleHomePositionSave}>
                            SAVE
                        </button>
                    </div> */}
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
      {Modal}
    </div>
  )
}

export default PowerRobot