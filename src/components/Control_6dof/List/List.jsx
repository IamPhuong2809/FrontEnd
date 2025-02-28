import React, { useState} from 'react'
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
        items,
        isPopupClosing,
        SelectedItem,
        handleItemSelect,
        handleDetailClose,
        headerName, 
    } = props;

    const ItemSelect = (item) => {
        // Nếu click vào item đã chọn, bỏ chọn nó
        if (SelectedItem && SelectedItem.id === item.id) {
            handleDetailClose();
        } else {
            handleItemSelect(item);
        }
    };

    //#endregion

    // #region Update items when props change
        const insertItem = (index, newItem, nextId) => {
            setItemsList((prevItems) => [
                ...prevItems.slice(0, index),
                { id: nextId++, ...newItem },
                ...prevItems.slice(index)
            ]);
        };

        const removeItem = (index) => {
            setItemsList((prevItems) => prevItems.filter((_, i) => i !== index));
        };

        const swapItems = (index1, index2) => {
            setItemsList((prevItems) => {
                const newItems = [...prevItems];
                [newItems[index1], newItems[index2]] = [newItems[index2], newItems[index1]];
                return newItems;
            });
        };

        const updateItem = (index, updatedItem) => {
            setItemsList((prevItems) => {
                const newItems = [...prevItems];
                newItems[index] = { ...newItems[index], ...updatedItem };
                return newItems;
            });
        };
    //#endregion

    //#region Hovered item
    const [hoveredItemId, setHoveredItemId] = useState(null);

    const shouldShowActions = (itemId) => {
        return hoveredItemId === itemId || (SelectedItem && SelectedItem.id === itemId);
    };
    //#endregion

    //#region Drag Drop
        const [itemsList, setItemsList] = useState([...items]);
        const [draggedItem, setDraggedItem] = useState(null);

        // Xử lý bắt đầu kéo
        const handleDragStart = (e, item) => {
            e.stopPropagation();
            setDraggedItem(item);
            // Thêm lớp styling để hiển thị item đang được kéo
            e.currentTarget.classList.add('dragging');
        };

        // Xử lý khi kéo qua item khác
        const handleDragOver = (e, item) => {
            e.preventDefault();
            e.stopPropagation();
            if (!draggedItem || draggedItem.id === item.id) return;
            
            e.currentTarget.classList.add('drag-over');
        };

        // Xử lý khi rời khỏi vùng drag over
        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('drag-over');
        };

        // Xử lý khi thả
        const handleDrop = (e, targetItem) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('drag-over');
            
            if (!draggedItem || draggedItem.id === targetItem.id) return;

            // Tạo mảng mới với thứ tự đã thay đổi
            const updatedItems = [...itemsList];
            const draggedIndex = updatedItems.findIndex(p => p.id === draggedItem.id);
            const targetIndex = updatedItems.findIndex(p => p.id === targetItem.id);
            
            // Loại bỏ item được kéo và chèn vào vị trí mới
            const [removed] = updatedItems.splice(draggedIndex, 1);
            updatedItems.splice(targetIndex, 0, removed);
            
            // Gán lại id mới theo thứ tự
            const newItemsList = updatedItems.map((item, index) => ({
                ...item,
                id: index + 1  // Gán lại id theo thứ tự mới
            }));

            setItemsList(newItemsList);
            
            // Ở đây bạn có thể gọi một hàm callback để thông báo cho component cha
            // Ví dụ: props.onReorder(updatedItems);
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
    <div>
        <div className={`points-list-container ${isPopupClosing ? 'slide-out' : 'slide-in'}`}>
            <div className="points-header">
                <div className="point-header-title">
                    <span>No. {headerName}</span>
                </div>
                <div className="point-header-img">
                    <img src={deleteItems} alt="delete-all" className="button-delete" />
                </div>
            </div>
            <div className="points-list">
                {itemsList && itemsList.map((item) => (
                <div 
                    key={item.id} 
						className={`point-item ${SelectedItem && SelectedItem.id === item.id ? 'selected' : ''}`}
						onClick={() => ItemSelect(item)}
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => handleDragOver(e, item)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item)}
                        onDragEnd={handleDragEnd}
                    >
						<div className="point-no">{item.id}</div>
						<div className="point-name">{item.name}</div>					
                        
                        {shouldShowActions(item.id) && (
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
    </div>
  )
}

export default List