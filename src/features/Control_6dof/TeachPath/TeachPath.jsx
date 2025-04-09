import React, {useState} from 'react'
import './TeachPath.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'
import List from '@components/Control_6dof/List/List'
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar'
import PopupScreen from '@components/Control_6dof/PopupTeachPath/PopupTeachPath'

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
            setSelectedPath(path);
            setIsPointOpen(true);
        }
        else {
            setSelectedPath(path);
            setIsPointOpen(true);
        }
    };

    const handlePathClose = () => {
        setIsPointClosing(true);

        setIsPointOpen(false);
        setSelectedPath(null);
        setIsPointClosing(false);

        setIsDetailOpen(false);
        setSelectedPoint(null);
    };
    //#endregion

    //#region Detail Point
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);

    const handlePointSelect = (point) => {
        if(isDetailOpen) {
            handleDetailClose();
            setSelectedPoint(point);
            setIsDetailOpen(true);
        }
        else {  
            setSelectedPoint(point);
            setIsDetailOpen(true);
        }
    };

    const handleDetailClose = () => {
        setIsDetailOpen(false);
        setSelectedPoint(null);
    };

    const coordinateRows = [
        [
          { label: 'X', main: '+0.00'},
          { label: 'Y', main: '-210.00'},
          { label: 'Z', main: '+495.00'}

        ],
        [
          { label: 'RX', main: '+180.00'},
          { label: 'RY', main: '+0.00'},
          { label: 'RZ', main: '+81.99'}
        ],
        [
            { label: 'Tool', main: '0'},
            { label: 'Figure', main: '+5'},
            { label: 'Work', main: '0'}
        ]
      ];


    //#endregion
    
  return (
   <div>
        <HeaderControl />
        <Menu />
        <div className='teach-path-robot-container'>
            <TaskBar />
            <div className="teach-management">
                <List 
                    items={paths} 
                    SelectedItem={selectedPath} 
                    isPopupOpen={true}
                    handleItemSelect={handlePathSelect} 
                    handleDetailClose={handlePathClose}
                    headerName="Path Name"
                    width="30vw"
                />
                {/* Point List (danh sách thứ hai) */}
                {isPointOpen && (
                    <List 
                    items={points} 
                    SelectedItem={selectedPoint}
                    handleItemSelect={handlePointSelect} 
                    handleDetailClose={handleDetailClose}
                    isPopupClosing={isPointClosing} 
                    headerName="Point Name" 
                    width="30vw"
                    />
                )}
                
                {/* Detail Screen cho Point được chọn */}
                {isDetailOpen && selectedPoint && (
                    <PopupScreen
                    selectedPoint={selectedPoint}
                    selectedPath={selectedPath}
                    coordinateRows={coordinateRows}
                    handleDetailClose={handleDetailClose}
                  />
                )}
            </div>
        </div>
   </div>
  )
}

export default TeachPath