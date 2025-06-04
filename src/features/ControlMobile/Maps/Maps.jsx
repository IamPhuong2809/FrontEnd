import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import HeaderControl from "@components/Header/Header";
import Menu from "@components/ControlMobile/Menu/Menu"
import List from '@components/ControlMobile/List/List'
import TaskBar from '@components/ControlMobile/TaskBar/TaskBar'
import PopupScreen from '@components/ControlMobile/PopupMap/PopupMap'
import Loading from '@components/Loading/Loading'
import './Maps.css'

const url = "http://127.0.0.1:8000/api/";

const Maps = () => {

    const location = useLocation();
    const { selectedMapBack, selectedSiteBack } = location.state || {};

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const [isMapClosing, setIsMapClosing] = useState(false);

    //#region api 
    const [sites, setSites] = useState(null);
    const [maps, setMaps] = useState(null);
    const [loading, setLoading] = useState(true); 

    const fetchLoadData = async (id) => {
        try {
            const response = await fetch(url + "O0031/", {
                method: "GET",
            });
            const data = await response.json();
            setSites(data);
            setLoading(false);
            if(selectedSiteBack)
                handleSiteSelect(selectedSiteBack);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchLoadData();
    }, [selectedMapBack, selectedSiteBack]); 

    const LoadMapInDB = async (id) => {
        try {
            const response = await fetch(url + "map/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type: null })
            });
            const data = await response.json();
            setMaps(data);
            if(selectedMapBack)
                handleMapSelect(selectedMapBack);            
        } catch (error) {
            console.error("Error:", error);
        }
    };

    //#endregion
    const handleSiteSelect = async (site) => {
        if (isMapOpen) {
            handleSiteClose();
        }
        setSelectedSite(site);
        await LoadMapInDB(site.id);
        setIsMapOpen(true);   
    };

    const handleSiteClose = () => {
        setIsMapClosing(true);

        setIsMapOpen(false);
        setSelectedSite(null);
        setIsMapClosing(false);

        setIsDetailOpen(false);
        setSelectedMap(null);
    };
    //#endregion

    //#region Detail Map
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedMap, setSelectedMap] = useState(null);

    const handleMapSelect = async (map) => {
        if (isDetailOpen) {
            handleDetailClose();
        }
        setSelectedMap(map);
        setIsDetailOpen(true);
    };

    const handleDetailClose = () => {
        setIsDetailOpen(false);
        setSelectedMap(null);
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <div>
            <HeaderControl />
            <Menu />
            <div className="maps-container" >
                <TaskBar />
                <div className="teach-management">
                    <List 
                        items={sites} 
                        SelectedItem={selectedSite} 
                        isPopupOpen={true}
                        handleItemSelect={handleSiteSelect} 
                        handleDetailClose={handleSiteClose}
                        headerName="Site Name"
                        width="30vw"
                    />
                    {/* Point List (danh sách thứ hai) */}
                    {isMapOpen && (
                        <List 
                        items={maps} 
                        SelectedParentId={selectedSite.id}
                        SelectedItem={selectedMap}
                        handleItemSelect={handleMapSelect} 
                        handleDetailClose={handleDetailClose}
                        isPopupClosing={isMapClosing} 
                        headerName="Map Name" 
                        width="30vw"
                        />
                    )}
                    
                    {/* Detail Screen cho Point được chọn */}
                    {isDetailOpen && selectedMap && (
                        <PopupScreen
                            selectedMap={selectedMap}
                            selectedSite={selectedSite}
                            handleDetailClose={handleDetailClose}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Maps;