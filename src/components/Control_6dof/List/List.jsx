import React, { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast';
import './List.css'
import { FaTrash, FaPen, FaPlus, FaCopy } from 'react-icons/fa';
import Rename from '@components/Rename/Rename'
import PopupCopy from '@components/Control_6dof/PopupCopy/PopupCopy';
import ConfirmDelete from '@components/ConfirmDelete/ConfirmDelete'
import { API_URL } from '@utils/config';


const List = (props) => {
    const { 
        items,
        SelectedParentId = -1,
        SelectedItem,
        handleItemSelect,
        handleDetailClose,
        headerName, 
        width,
        haveCopy,
    } = props;

    //#region database
    const [typeData, setTypeData] = useState(null);

    useEffect(() => {
        if (headerName === "Global Point Name") {
        setTypeData("global");
        } else if (headerName === "Path Name") {
        setTypeData("path");
        } else {
        setTypeData("point");
        }
    }, [headerName]);

    const addItemToDB = async (id_parent, id, name) => {
        const response = await fetch( API_URL + `${typeData}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_parent, id, name, type:"add" })
        });
        const data = await response.json();
        if(data.success){
        toast.success("Successfully add component!", {
            style: {border: '1px solid green'}});
        } else {
        toast.error("Failed to add: " + data.error, {
            style: {border: '1px solid red'}});
        }
    };
    
    const renameItemInDB = async (id_parent, id, name) => {
        const response = await fetch( API_URL + `${typeData}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_parent, id, name, type:"rename" })
        });
        const data = await response.json();
        if(data.success){
        toast.success("Successfully rename component!", {
            style: {border: '1px solid green'}});
        } else {
        toast.error("Failed to rename: " + data.error, {
            style: {border: '1px solid red'}});
        }
    };

    const updateItemInDB = async (id_parent, id, id_target) => {
        const response = await fetch( API_URL + `${typeData}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_parent, id, id_target, type:"update" })
        });
        const data = await response.json();
        if(data.success){
        toast.success("Successfully update component!", {
            style: {border: '1px solid green'}});
        } else {
        toast.error("Failed to update: " + data.error, {
            style: {border: '1px solid red'}});
        }
    };
    
    const deleteItemInDB = async (id_parent, id) => {
        const response = await fetch( API_URL + `${typeData}/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_parent, id, delete_all:false})
        });
        const data = await response.json();
        if(data.success){
        toast.success("Successfully delete component!", {
            style: {border: '1px solid green'}});
        } else {
        toast.error("Failed to delete: " + data.error, {
            style: {border: '1px solid red'}});
        }
    };

    const deleteAllDB = async (id_parent) => {
        const response = await fetch( API_URL + `${typeData}/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_parent, delete_all:true})
        });
        const data = await response.json();
        if(data.success){
        toast.success("Successfully delete all components!", {
            style: {border: '1px solid green'}});
        } else {
        toast.error("Failed to delete: " + data.error, {
            style: {border: '1px solid red'}});
        }
    };
    
    //#endregion


    // State cho rename modal
    const [showRename, setShowRename] = useState(false);
    const [showCopy, setshowCopy] = useState(false);
    const [renameMode, setRenameMode] = useState(''); 
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [itemsList, setItemsList] = useState([...items]);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToCopy, setItemToCopy] = useState(null);
    const [deleteAllItems, setdeleteAllItems] = useState(false);
    const [delay, setDelay] = useState(0);

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

    const handleAddItem = (item) => {
        setRenameMode('add');
        setCurrentEditItem(item);
        setShowRename(true);
    };

    const handleRenameItem = (item) => {
        setRenameMode('edit');
        setCurrentEditItem(item);
        setShowRename(true);
    };

    const handleRenameConfirm = async (newName) => {
        if (renameMode === 'add') {
            const insertIndex = itemsList.findIndex(i => i.id === currentEditItem.id) + 1 ;
            
            const updatedItems = [
                ...itemsList.slice(0, insertIndex),
                { id: itemsList.length + 1, name: newName }, // Thêm luôn ID mới
                ...itemsList.slice(insertIndex)
            ];
            
            // Normalize lại ID từ 1
            const normalizedItems = updatedItems.map((item, index) => ({
                ...item,
                id: index + 1
            }));
            
            setItemsList(normalizedItems);
            await addItemToDB(SelectedParentId, insertIndex + 1, newName);
        } else {
            // Cập nhật item hiện có
            const updatedItems = itemsList.map(item => 
                item.id === currentEditItem.id ? { ...item, name: newName } : item
            );
            setItemsList(updatedItems);
            await renameItemInDB(SelectedParentId, currentEditItem.id, newName);
        }
        setShowRename(false);
    };

    const handleDeleteClick = (item, e) => {
        e.stopPropagation();
        setItemToDelete(item);
        setdeleteAllItems(false);
        setDelay(0);
        setDeleteDialogOpen(true);
    };

    const handleDeleteAllConfirm = (e) => {
        e.stopPropagation();
        setItemToDelete(null);
        setdeleteAllItems(true);
        setDelay(3);
        setDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if(deleteAllItems === false){
            let updatedItems = itemsList.filter(item => item.id !== itemToDelete.id);
            updatedItems = updatedItems.map((item, index) => ({
                ...item,
                id: index + 1
            }));
            setItemsList(updatedItems);
            setDeleteDialogOpen(false);
    
            await deleteItemInDB(SelectedParentId, itemToDelete.id);
            
            if (SelectedItem?.id === itemToDelete.id) {
                handleDetailClose();
            }
        }
        else{
            setItemsList([]);
            setDeleteDialogOpen(false);
            handleDetailClose();
            await deleteAllDB(SelectedParentId);
        }
    };

    const handleCopyClick = (item, e) => {
        e.stopPropagation();
        setItemToCopy(item);
        setshowCopy(true);
    }

    const PopupCopyWrapper = useMemo(() => {
        if (!showCopy) return null;
        return (
            <div className="popup-copy-overlay">
                <div className="popup-copy-content">
                    <PopupCopy 
                        ClosePopup={() => setshowCopy(false)}
                        IdPathCopy={SelectedParentId}
                        PointCopy={itemToCopy}
                    />
                </div>
            </div>
        );
    }, [showCopy]);

    //#region Drag and drop handlers
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

    const handleDrop = async(e, targetItem) => {
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
        await updateItemInDB(SelectedParentId, draggedIndex + 1, targetIndex + 1 );
        handleItemSelect(newItemsList[targetIndex])
    };

    const handleDragEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragging');
        setDraggedItem(null);
    };
    //#endregion

    return (
        <div>
            <div className={`points-list-container`} style={{ width: width }}>
                <div className="points-header">
                    <div className="point-header-title">
                        <span>No. {headerName}</span>
                    </div>
                    <div className="point-header-img">
                        <FaTrash
                            style={{ color: '#f23a3a', cursor: 'pointer' }} 
                            alt="delete-all" 
                            className="button-delete"
                            onClick={(e) => handleDeleteAllConfirm(e)} 
                        />
                    </div>
                </div>
                <div className="points-list">
                    {itemsList.length === 0 ? (
                        <div className="empty-list">
                            <p>No items found.</p>
                            <button className="add-button-center" onClick={() => handleAddItem({ id: 0 })}>
                                + Add Item
                            </button>
                        </div>
                    ) : (
                        itemsList.map((item) => (
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
                                            <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>Rename</div>
                                            <FaPen
                                                style={{ color: '#ed7e1c', cursor: 'pointer' }} 
                                                className="action-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRenameItem(item);
                                                }}
                                            />
                                        </div>
                                    
                                        {haveCopy && (
                                        <div className="action-button-wrapper">
                                            <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>Copy</div>
                                            <FaCopy
                                            style={{ color: '#40cde6', cursor: 'pointer' }} 
                                            className="action-button"
                                            onClick={(e) => {
                                                handleCopyClick(item, e);
                                            }}
                                            />
                                        </div>
                                        )}
                                    
                                        <div className="action-button-wrapper">
                                            <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>Delete</div>
                                            <FaTrash
                                                style={{ color: '#f87171', cursor: 'pointer' }} 
                                                className="action-button"
                                                onClick={(e) => handleDeleteClick(item, e)}
                                            />
                                        </div>
                                    
                                        <div className="action-button-wrapper">
                                            <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>Add</div>
                                            <FaPlus
                                                style={{ color: '#1ced1c', cursor: 'pointer' }} 
                                                className="action-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddItem(item);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )))
                    }
                </div>
                <div className="scroll-button" style={{width: width}}>
                        <span>▼</span>
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
            {PopupCopyWrapper}

            <ConfirmDelete
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name}
                delaySeconds={delay}
            />
        </div>
    )
}

export default List