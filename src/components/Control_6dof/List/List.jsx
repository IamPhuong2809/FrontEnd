import React, { useState } from 'react'
import './List.css'
import deleteItems from '@images/deleteItems.png'
import renameItem from '@images/renameItem.png'
import deleteItem from '@images/deleteItem.png'
import addItem from '@images/addItem.png'
import copyItem from '@images/copyItem.png'
import Rename from '@components/Rename/Rename'

const List = (props) => {
    const { 
        items,
        isPopupClosing,
        SelectedItem,
        handleItemSelect,
        handleDetailClose,
        headerName, 
        width,
    } = props;

    // State cho rename modal
    const [showRename, setShowRename] = useState(false);
    const [renameMode, setRenameMode] = useState(''); 
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [itemsList, setItemsList] = useState([...items]);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);

    const ItemSelect = (item) => {
        if (SelectedItem && SelectedItem.id === item.id) {
            handleDetailClose();
        } else {
            handleItemSelect(item);
        }
    };

    const shouldShowActions = (itemId) => {
        return hoveredItemId === itemId || (SelectedItem && SelectedItem.id === itemId);
    };

    const handleAddItem = () => {
        setRenameMode('add');
        setCurrentEditItem(null);
        setShowRename(true);
    };

    const handleRenameItem = (item) => {
        setRenameMode('edit');
        setCurrentEditItem(item);
        setShowRename(true);
    };

    const handleRenameConfirm = (newName) => {
        if (renameMode === 'add') {
            const newId = itemsList.length > 0 ? Math.max(...itemsList.map(i => i.id)) + 1 : 1;
            const newItem = {
                id: newId,
                name: newName
            };
            setItemsList([...itemsList, newItem]);
        } else {
            // Cập nhật item hiện có
            const updatedItems = itemsList.map(item => 
                item.id === currentEditItem.id ? { ...item, name: newName } : item
            );
            setItemsList(updatedItems);
        }
        setShowRename(false);
    };

    // Drag and drop handlers
    const handleDragStart = (e, item) => {
        e.stopPropagation();
        setDraggedItem(item);
        e.currentTarget.classList.add('dragging');
    };

    const handleDragOver = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedItem || draggedItem.id === item.id) return;
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, targetItem) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
        
        if (!draggedItem || draggedItem.id === targetItem.id) return;

        const updatedItems = [...itemsList];
        const draggedIndex = updatedItems.findIndex(p => p.id === draggedItem.id);
        const targetIndex = updatedItems.findIndex(p => p.id === targetItem.id);
        
        const [removed] = updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(targetIndex, 0, removed);
        
        const newItemsList = updatedItems.map((item, index) => ({
            ...item,
            id: index + 1
        }));

        setItemsList(newItemsList);
    };

    const handleDragEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragging');
        setDraggedItem(null);
    };

    return (
        <div>
            <div className={`points-list-container ${isPopupClosing ? 'slide-out' : 'slide-in'}`} style={{ width: width }}>
                <div className="points-header">
                    <div className="point-header-title">
                        <span>No. {headerName}</span>
                    </div>
                    <div className="point-header-img">
                        <img src={deleteItems} alt="delete-all" className="button-delete" />
                    </div>
                </div>
                <div className="points-list">
                    {itemsList.map((item) => (
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
                                        <div className="tooltip">Rename</div>
                                        <img 
                                            src={renameItem} 
                                            alt="Rename" 
                                            className="action-button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRenameItem(item);
                                            }}
                                        />
                                    </div>
                                    <div className="action-button-wrapper">
                                        <div className="tooltip">Copy</div>
                                        <img src={copyItem} alt="Copy" className="action-button" />
                                    </div>
                                    <div className="action-button-wrapper">
                                        <div className="tooltip">Delete</div>
                                        <img src={deleteItem} alt="Delete" className="action-button" />
                                    </div>
                                    <div className="action-button-wrapper">
                                        <div className="tooltip">Add</div>
                                        <img 
                                            src={addItem} 
                                            alt="Add" 
                                            className="action-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddItem();
                                            }} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="scroll-button" style={{width: width}}>
                        <span>▼</span>
                    </div>
                </div>
            </div>

            {/* Rename Modal */}
            {showRename && (
                <Rename
                    initialName={renameMode === 'add' ? '' : currentEditItem?.name || ''}
                    title={renameMode === 'add' ? 'Add New Item' : 'Rename Item'}
                    onCancel={() => setShowRename(false)}
                    onConfirm={handleRenameConfirm}
                />
            )}
        </div>
    )
}

export default List