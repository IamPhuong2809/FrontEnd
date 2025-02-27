import React, { useState } from 'react'
import './List.css'
import deleteItems from '@images/deleteItems.png'
import renameItem from '@images/renameItem.png'
import deleteItem from '@images/deleteItem.png'
import addItem from '@images/addItem.png'
import copyItem from '@images/copyItem.png'

//, copyScreen, updateItems,

const List = (props) => {

    //#region Destructure props properly
    const { 
        points, 
        noSelectingItem, 
        isPopupOpen,  
        handleDetailClose,
        headerName, 
        PopupScreen 
    } = props;

    const [selectedPoint, setSelectedPoint] = useState(null);

    const handlePointSelect = (point) => {
        // Nếu click vào item đã chọn, bỏ chọn nó
        if (selectedPoint && selectedPoint.id === point.id) {
            setSelectedPoint(null);
            noSelectingItem(null);
            handleDetailClose();
        } else {
            setSelectedPoint(point);
            noSelectingItem(point);
        }
    };
    //#endregion

    //#region Update points when props change
        const addPoint = (newPoint, nextId) => {
            setPointsList((prevPoints) => [
                ...prevPoints,
                { id: nextId++, ...newPoint }
            ]);
        };

        const insertPoint = (index, newPoint, nextId) => {
            setPointsList((prevPoints) => [
                ...prevPoints.slice(0, index),
                { id: nextId++, ...newPoint },
                ...prevPoints.slice(index)
            ]);
        };

        const removePoint = (index) => {
            setPointsList((prevPoints) => prevPoints.filter((_, i) => i !== index));
        };

        const swapPoints = (index1, index2) => {
            setPointsList((prevPoints) => {
                const newPoints = [...prevPoints];
                [newPoints[index1], newPoints[index2]] = [newPoints[index2], newPoints[index1]];
                return newPoints;
            });
        };

        const updatePoint = (index, updatedPoint) => {
            setPointsList((prevPoints) => {
                const newPoints = [...prevPoints];
                newPoints[index] = { ...newPoints[index], ...updatedPoint };
                return newPoints;
            });
        };
    //#endregion

    //#region Hovered item
    const [hoveredItemId, setHoveredItemId] = useState(null);

    const shouldShowActions = (pointId) => {
        return hoveredItemId === pointId || (selectedPoint && selectedPoint.id === pointId);
    };
    //#endregion

    //#region Drag Drop
        const [pointsList, setPointsList] = useState([...points]);
        const [draggedItem, setDraggedItem] = useState(null);

        // Xử lý bắt đầu kéo
        const handleDragStart = (e, point) => {
            e.stopPropagation();
            setDraggedItem(point);
            // Thêm lớp styling để hiển thị item đang được kéo
            e.currentTarget.classList.add('dragging');
        };

        // Xử lý khi kéo qua item khác
        const handleDragOver = (e, point) => {
            e.preventDefault();
            e.stopPropagation();
            if (!draggedItem || draggedItem.id === point.id) return;
            
            e.currentTarget.classList.add('drag-over');
        };

        // Xử lý khi rời khỏi vùng drag over
        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('drag-over');
        };

        // Xử lý khi thả
        const handleDrop = (e, targetPoint) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('drag-over');
            
            if (!draggedItem || draggedItem.id === targetPoint.id) return;

            // Tạo mảng mới với thứ tự đã thay đổi
            const updatedPoints = [...pointsList];
            const draggedIndex = updatedPoints.findIndex(p => p.id === draggedItem.id);
            const targetIndex = updatedPoints.findIndex(p => p.id === targetPoint.id);
            
            // Loại bỏ item được kéo và chèn vào vị trí mới
            const [removed] = updatedPoints.splice(draggedIndex, 1);
            updatedPoints.splice(targetIndex, 0, removed);
            
            // Gán lại id mới theo thứ tự
            const newPointsList = updatedPoints.map((point, index) => ({
                ...point,
                id: index + 1  // Gán lại id theo thứ tự mới
            }));

            setPointsList(newPointsList);
            
            // Ở đây bạn có thể gọi một hàm callback để thông báo cho component cha
            // Ví dụ: props.onReorder(updatedPoints);
        };

        // Xử lý khi kết thúc kéo
        const handleDragEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('dragging');
            setDraggedItem(null);
        };
    //#endregion

  return (
    <div className="point-management">
        <div className="points-list-container">
            <div className="points-header">
                <div className="point-header-title">
                    <span>No. {headerName}</span>
                </div>
                <div className="point-header-img">
                    <img src={deleteItems} alt="delete-all" className="button-delete" />
                </div>
            </div>
            <div className="points-list">
                {pointsList && pointsList.map((point) => (
                <div 
                    key={point.id} 
						className={`point-item ${selectedPoint && selectedPoint.id === point.id ? 'selected' : ''}`}
						onClick={() => handlePointSelect(point)}
                        onMouseEnter={() => setHoveredItemId(point.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, point)}
                        onDragOver={(e) => handleDragOver(e, point)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, point)}
                        onDragEnd={handleDragEnd}
                    >
						<div className="point-no">{point.id}</div>
						<div className="point-name">{point.name}</div>					
                        
                        {shouldShowActions(point.id) && (
                            <div className="item-actions">
                                <div className="action-button-wrapper">
                                    <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>
                                        Rename</div>
                                    <img src={renameItem} alt="View" className="action-button" />
                                </div>
                                <div className="action-button-wrapper">
                                    <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>
                                        Copy</div>
                                    <img src={copyItem} alt="Edit" className="action-button" />
                                </div>
                                <div className="action-button-wrapper">
                                    <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>
                                        Delete</div>
                                    <img src={deleteItem} alt="Delete" className="action-button" />
                                </div>
                                <div className="action-button-wrapper">
                                    <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>
                                        Add</div>
                                    <img src={addItem} alt="Copy" className="action-button" />
                                </div>
                            </div>
                        )}

                    </div>
                ))}
                <div className="scroll-button">
                    <span>▼</span>
                </div>
            </div>
        </div>

        {isPopupOpen && PopupScreen && (
            <PopupScreen />
        )}
    </div>
  )
}

export default List