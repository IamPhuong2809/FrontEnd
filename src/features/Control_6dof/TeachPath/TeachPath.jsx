
import React, {useState, useEffect} from 'react'
import './TeachPath.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Header/Header'
import List from '@components/Control_6dof/List/List'
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar'
import PopupScreen from '@components/Control_6dof/PopupTeachPath/PopupTeachPath'
import Loading from '@components/Loading/Loading'
import { API_URL } from '@utils/config';


const TeachPath = () => {

    const [isPointOpen, setIsPointOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);

    //#region api 
    const [paths, setPaths] = useState(null);
    const [points, setPoints] = useState(null);
    const [loading, setLoading] = useState(true); 

    const fetchLoadData = async (id) => {
        try {
            const response = await fetch(API_URL + "O0007/", {
                method: "GET",
            });
            const data = await response.json();
            setPaths(data);
            const savedPath = localStorage.getItem("selected_path");
            const savedPoint = localStorage.getItem("selected_point");
            localStorage.removeItem("selected_point");
            localStorage.removeItem("selected_path");
            if (savedPoint && savedPath) {
                handlePathSelect(data.find(p => p.id === JSON.parse(savedPath)));
                setSelectedPoint(JSON.parse(savedPoint));
                setIsDetailOpen(true);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchLoadData();
    }, []); 

    const LoadPointInDB = async (id) => {
        try {
            const response = await fetch(API_URL + "point/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type: null })
            });
            const data = await response.json();
            setPoints(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    //#endregion
    const handlePathSelect = async (path) => {
        if(isPointOpen) {
            handlePathClose();
        }
        setSelectedPath(path);
        await LoadPointInDB(path.id);
        setIsPointOpen(true);   
    };

    const handlePathClose = () => {
        setIsPointOpen(false);
        setSelectedPath(null);
        setIsDetailOpen(false);
        setSelectedPoint(null);
    };
    //#endregion

    //#region Detail Point

    const handlePointSelect = async (point) => {
        if(isDetailOpen) {
            handleDetailClose();
        }
        setSelectedPoint(point);
        setIsDetailOpen(true);
    };

    const handleDetailClose = () => {
        setIsDetailOpen(false);
        setSelectedPoint(null);
    };


    //#endregion
    
    if (loading) {
        return <Loading/>;
    }

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
                    SelectedParentId={selectedPath.id}
                    SelectedItem={selectedPoint}
                    handleItemSelect={handlePointSelect} 
                    handleDetailClose={handleDetailClose}
                    headerName="Point Name" 
                    width="30vw"
                    haveCopy='True'
                    />
                )}
                
                {/* Detail Screen cho Point được chọn */}
                {isDetailOpen && selectedPoint && (
                    <PopupScreen
                    selectedPoint={selectedPoint}
                    selectedPath={selectedPath}
                    handleDetailClose={handleDetailClose}
                  />
                )}
            </div>
        </div>
   </div>
  )
}

export default TeachPath