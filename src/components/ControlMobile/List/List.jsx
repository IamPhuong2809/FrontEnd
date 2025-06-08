import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import './List.css'
import { FaTrash, FaPen} from 'react-icons/fa';
import Rename from '@components/Rename/Rename'
import ConfirmDelete from '@components/ConfirmDelete/ConfirmDelete'

const url = "http://127.0.0.1:8000/api/"

const List = (props) => {
    const { 
        items,
        isPopupClosing,
        SelectedParentId = -1,
        SelectedItem,
        handleItemSelect,
        handleDetailClose,
        headerName, 
        width,
    } = props;

    //#region database
    const [typeData, setTypeData] = useState(null);

    useEffect(() => {
        if (headerName === "Site Name") {
        setTypeData("site");
        } else {
        setTypeData("map");
        }
    }, [headerName]);

    const addItemToDB = async (id_parent, id, name) => {
        const response = await fetch( url + `${typeData}/`, {
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
        const response = await fetch( url + `${typeData}/`, {
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
    
    const deleteItemInDB = async (id_parent, id) => {
        const response = await fetch( url + `${typeData}/`, {
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
        const response = await fetch( url + `${typeData}/`, {
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
    const [renameMode, setRenameMode] = useState(''); 
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [itemsList, setItemsList] = useState([...items]);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
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

    return (
        <div>
            <div className={`points-list-container ${isPopupClosing ? 'slide-out' : 'slide-in'}`} style={{ width: width }}>
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
                    {itemsList.map((item) => (
                            <div 
                                key={item.id} 
                                className={`point-item ${SelectedItem && SelectedItem.id === item.id ? 'selected' : ''}`}
                                onClick={() => ItemSelect(item)}
                                onMouseEnter={() => setHoveredItemId(item.id)}
                                onMouseLeave={() => setHoveredItemId(null)}
                                draggable={true}
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
                                        <div className="action-button-wrapper">
                                            <div className={`tooltip ${hoveredItemId === 1 ? 'below' : 'above'}`}>Delete</div>
                                            <FaTrash
                                                style={{ color: '#f87171', cursor: 'pointer' }} 
                                                className="action-button"
                                                onClick={(e) => handleDeleteClick(item, e)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    }
                    <div className="add-item">
                        <button className="add-button-center" onClick={() => handleAddItem({ id: itemsList.length })}>
                            + Add Item
                        </button>
                    </div>
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