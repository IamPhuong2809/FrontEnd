import React, { useState } from 'react'
import './PositionList.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'

const PositionList = () => {

	//#region List of Points
    const points =[
        { id: 1, name: 'Home' },
        { id: 2, name: 'Prepick Pos 1' },
        { id: 3, name: 'PickPos 1' },
        { id: 4, name: 'Prepick Pos 2' },
        { id: 5, name: 'Pick Pos 2' },
        { id: 6, name: 'type_a_name' },
        { id: 7, name: 'type_a_name' },
        { id: 8, name: 'type_a_name' },
        { id: 9, name: 'type_a_name' },
        { id: 10, name: 'type_a_name' },
        { id: 11, name: 'type_a_name' },
        { id: 12, name: 'type_a_name' },
        { id: 13, name: 'type_a_name' },
        { id: 14, name: 'type_a_name' },
        ];
	//#endregion

	//#region Detail of Point
		const [activeOption, setActiveOption] = useState('ACTIVE');
	
		const handleOptionChange = (option) => {
		setActiveOption(option);
		};
		
		const handleMoveToPoint = () => {
		console.log('Moving to point...');
		// Implement actual move functionality here
		};
		
		const handleAbort = () => {
		console.log('Movement aborted');
		// Implement abort functionality here
		};

	//#endregion

    //#region Popup Screen
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState();
    
    const handleDetailClose = () => {
        setIsDetailOpen(false);
        setSelectedPoint(null);
    };

    const handlePointSelect = (point) => {
        setSelectedPoint(point);
        setIsDetailOpen(true);
    };

    const PopupScreen = () => {

        return (
            <div className="point-detail">
                <div className="point-detail-header">
                    <div className="point-detail-title">[Point {selectedPoint.id}] "{selectedPoint.name}"</div>
                    <button className="close-button" onClick={handleDetailClose}>✕</button>
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
                                    <span
                                    className={`option-span ${activeOption === 'ACTIVE' ? 'active' : ''}`}
                                    onClick={() => handleOptionChange('ACTIVE')}
                                    >
                                    BUSY
                                    </span>
                                    <span 
                                    className={`option-span ${activeOption === 'APPROXH' ? 'active' : ''}`}
                                    onClick={() => handleOptionChange('APPROXH')}
                                    >
                                    ACTIVE
                                    </span>
                                    <span 
                                    className={`option-span ${activeOption === 'LINGER' ? 'active' : ''}`}
                                    onClick={() => handleOptionChange('LINGER')}
                                    >
                                    ERROR
                                    </span>
                                </div>
                                <div className="option-span-bottom">
                                    <span 
                                    className={`option-span ${activeOption === 'DONE' ? 'active' : ''}`}
                                    onClick={() => handleOptionChange('DONE')}
                                    >
                                    DONE
                                    </span>
                                    <span 
                                    className={`option-span ${activeOption === 'ABORTED' ? 'active' : ''}`}
                                    onClick={() => handleOptionChange('ABORTED')}
                                    >
                                    ABORTED
                                    </span>
                                </div>
                            </div>
                        
                            <div className="error-text">
                                Error Text:
                            </div>

                            <div className="action-buttons">
                                <button className="move-button" onClick={handleMoveToPoint}>
                                MOVE TO POINT
                                </button>
                                <button className="abort-button" onClick={handleAbort}>
                                Abort Movement
                                </button>
                            </div>
                        </div>
                        
                        <div className="position-section-desired">
                            <div className="position-header">Desired Position:</div>
                            <div className="position-data">
                                <div className="position-row">
                                    <div className="position-label">X</div>
                                    <div className="position-value">-57.54mm</div>
                                </div>
                                <div className="position-row">
                                    <div className="position-label">Y</div>
                                    <div className="position-value">210.00mm</div>
                                </div>
                                <div className="position-row">
                                    <div className="position-label">Z</div>
                                    <div className="position-value">463.14mm</div>
                                </div>
                                <div className="position-row">
                                    <div className="position-label">RX</div>
                                    <div className="position-value">180.00°</div>
                                </div>
                                <div className="position-row">
                                    <div className="position-label">RY</div>
                                    <div className="position-value">0.00°</div>
                                </div>
                                <div className="position-row">
                                    <div className="position-label">RZ</div>
                                    <div className="position-value">-81.49°</div>
                                </div>
                                <div className="position-row">
                                    <div className="position-label">FIG</div>
                                    <div className="position-value">5</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="position-section-current">
                        <div className="position-header">Current Position:</div>
                        <div className="position-data">
                            <div className="position-row">
                                <div className="position-label">X</div>
                                <div className="position-value">-57.54mm</div>
                            </div>
                            <div className="position-row">
                                <div className="position-label">Y</div>
                                <div className="position-value">210.00mm</div>
                            </div>
                            <div className="position-row">
                                <div className="position-label">Z</div>
                                <div className="position-value">463.14mm</div>
                            </div>
                            <div className="position-row">
                                <div className="position-label">RX</div>
                                <div className="position-value">180.00°</div>
                            </div>
                            <div className="position-row">
                                <div className="position-label">RY</div>
                                <div className="position-value">0.00°</div>
                            </div>
                            <div className="position-row">
                                <div className="position-label">RZ</div>
                                <div className="position-value">-81.49°</div>
                            </div>
                            <div className="position-row">
                                <div className="position-label">FIG</div>
                                <div className="position-value">5</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    //#endregion

    return (
    <div>
        <HeaderControl />
        <Menu />
        <div>
            <List 
                points={points} 
                noSelectingItem={handlePointSelect} 
                isPopupOpen={isDetailOpen} 
                handleDetailClose={handleDetailClose}
                headerName="Point Name" 
                PopupScreen={PopupScreen} />
        </div>
    </div>
    )
}

export default PositionList