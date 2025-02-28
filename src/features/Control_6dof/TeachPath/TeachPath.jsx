import React, {useState} from 'react'
import './TeachPath.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'

const TeachPath = () => {

    //#region List of Points
    const paths =[
        { id: 1, name: 'Take' },
        { id: 2, name: 'Bring' },
        { id: 3, name: 'Place' },
        { id: 4, name: 'Prepick' },
        { id: 5, name: 'Pick' },
        { id: 6, name: 'See' },
        { id: 7, name: 'Run' },
        { id: 8, name: 'type_a_name' },
        { id: 9, name: 'type_a_name' },
        { id: 10, name: 'type_a_name' },
        { id: 11, name: 'type_a_name' },
        { id: 12, name: 'type_a_name' },
        { id: 13, name: 'type_a_name' },
        { id: 14, name: 'type_a_name' },
        ];
    //#endregion

    //#region Point List Screen
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

    const [isPointOpen, setIsPointOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState(null);
    const [isPointClosing, setIsPointClosing] = useState(false);

    const handlePathSelect = (path) => {
        if(isPointOpen) {
            handlePathClose();
            setTimeout(() => {
                setSelectedPath(path);
                setIsPointOpen(true);
            }, 500);
        }
        else {
            setSelectedPath(path);
            setIsPointOpen(true);
        }
    };

    const handlePathClose = () => {
        setIsPointClosing(true);
        setTimeout(() => {
            setIsPointOpen(false);
            setSelectedPath(null);
            setIsPointClosing(false);
        }, 500);
    };

    const PointList = () => {
        return (
            <List 
                items={points} 
                SelectedItem={selectedPoint}
                handleItemSelect={handlePointSelect} 
                handleDetailClose={handleDetailClose}
                isPopupClosing={isPointClosing} 
                headerName="Point Name" 
            />
        )
    }
    //#endregion

    //#region Detail Point
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isDetailClosing, setIsDetailClosing] = useState(false);

    const handlePointSelect = (point) => {
        if(isDetailOpen) {
            handleDetailClose();
            setTimeout(() => {
                setSelectedPoint(point);
                setIsDetailOpen(true);
            }, 500);
        }
        else {
            setSelectedPoint(point);
            setIsDetailOpen(true);
        }
    };

    const handleDetailClose = () => {
        setIsDetailClosing(true);
        setTimeout(() => {
            setIsDetailOpen(false);
            setSelectedPoint(null);
            setIsDetailClosing(false);
        }, 500);
    };

    const PopupScreen = () => {
        return(
            <div>abc</div>
        )
    }
    //#endregion
    
  return (
   <div>
        <HeaderControl />
        <Menu />
        <div className="teach-management">
            <List 
                items={paths} 
                SelectedItem={selectedPath} 
                isPopupOpen={true}
                handleItemSelect={handlePathSelect} 
                handleDetailClose={handlePathClose}
                headerName="Path Name"
            />
            {/* Hiển thị PopupScreen nếu có item được chọn */}
            {isPointOpen && PointList && <PointList />}
        </div>
   </div>
  )
}

export default TeachPath