import React, { useState } from 'react'
import HeaderControl from '@components/Control_6dof/Header/Header'
import './PowerRobot.css'
import Table from '@components/Control_6dof/Table/Table'
import Menu from '@components/Control_6dof/Menu/Menu'


const PowerRobot = () => {
  const [showModal, setShowModal] = useState(false);

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
                />
            </div>
        </div>
    );
  };
  //#endregion Modals

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
                  <button className='btn-off active'>Off</button>
                  <button className='btn-on'>On</button>
                </div>
              </div>
              <div className='status-list'>
                <div className='status-item powered'>Powered</div>
                <div className='status-item no-error'>No Error</div>
                <div className='status-item ready'>Robot is ready to move</div>
                <div className='status-item on'>End-Effector ON</div>
                <button className='btn-reset'>Reset</button>
                <button className='btn-abort'>Abort</button>
              </div>
            </div>
            <div className='control-card error-section'>
              <h3>Error IDs</h3>
              <div className='error-list'>
              {[1, 2, 3, 4].map(num => (
                  <div className='error-row' key={num}>
                  <span>Error ID {num}</span>
                  <span>0000</span>
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
                <div className='position-row'>
                  <span>X</span>
                  <span>+170.08mm</span>
                </div>
                <div className='position-row'>
                  <span>Y</span>
                  <span>-223.05mm</span>
                </div>
                <div className='position-row'>
                  <span>Z</span>
                  <span>+432.70mm</span>
                </div>
                <div className='position-row'>
                  <span>Roll</span>
                  <span>+177.64°</span>
                </div>
                <div className='position-row'>
                  <span>Pitch</span>
                  <span>+16.31°</span>
                </div>
                <div className='position-row'>
                  <span>Yaw</span>
                  <span>+118.98°</span>
                </div>
              </div>
            </div>
            <div className='control-card axis-section'>
              <h3>Axis Position</h3>
              <div className='axis-display'>
                <div className='axis-row'>
                  <span>J1</span>
                  <span>-52.67°</span>
                </div>
                <div className='axis-row'>
                  <span>J2</span>
                  <span>+10.44°</span>
                </div>
                <div className='axis-row'>
                  <span>J3</span>
                  <span>+95.79°</span>
                </div>
                <div className='axis-row'>
                  <span>J4</span>
                  <span>+0.00°</span>
                </div>
                <div className='axis-row'>
                  <span>J5</span>
                  <span>+57.29°</span>
                </div>
                <div className='axis-row'>
                  <span>J6</span>
                  <span>+8.01°</span>
                </div>
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
              <div className='home-position-grid'>
                <div className='position-group'>
                  <div className='position-label'>X</div>
                  <input type="text" value="170.09" readOnly />
                </div>
                <div className='position-group'>
                  <div className='position-label'>Y</div>
                  <input type="text" value="-223.05" readOnly />
                </div>
                <div className='position-group'>
                  <div className='position-label'>Z</div>
                  <input type="text" value="432.71" readOnly />
                </div>
                <div className='home-position-actions'>
                  <button className='btn-default'>DEFAULT</button>
                </div>
                <div className='position-group'>
                  <div className='position-label'>Rl</div>
                  <input type="text" value="177.64" readOnly />
                </div>
                <div className='position-group'>
                  <div className='position-label'>Pt</div>
                  <input type="text" value="16.31" readOnly />
                </div>
                <div className='position-group'>
                  <div className='position-label'>Yw</div>
                  <input type="text" value="118.98" readOnly />
                </div>
                <div className='home-position-actions'>
                  <button className='btn-save'>SAVE</button>
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