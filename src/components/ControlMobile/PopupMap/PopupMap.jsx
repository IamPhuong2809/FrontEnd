import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './PopupMap.css';
import toast from 'react-hot-toast';
import { FaCloudDownloadAlt, FaBook, FaSyncAlt } from 'react-icons/fa';
import { BsRecordCircleFill } from 'react-icons/bs';
import { useMapContext } from '@components/ControlMobile/MapContext';
import { API_URL } from '@utils/config';


const PopupMap = (props) => {
    const navigate = useNavigate();
    const { updateSelection } = useMapContext();
    const handleNavigation = (path) => {
        updateSelection(selectedMap, selectedSite);
        navigate(path);
    };

    const {
        selectedMap,
        selectedSite,
        handleDetailClose,
    } = props;

    const [mapData, setMapData] = useState(null);

    const fetchLoadData = async () => {
        try {
          const response = await fetch(API_URL + "map/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({id_parent:selectedSite.id, id:selectedMap.id, type:"data"})
          });
          const data = await response.json();
          setMapData(data[0]);
        } catch (error) {
            console.error("Error:", error);
        }
    };
  
    useEffect(() => {
        fetchLoadData();
    }, [selectedMap]); 

    return (
        <div className='map-detail-choice'>
            <div className="map-detail-header">
                <div className="map-detail-title">
                    [Map {selectedMap.id}] "{selectedMap.name}"
                </div>
                <button className="close-button" onClick={handleDetailClose}>
                    ✕
                </button>
            </div>
            <div className="map-controls">
                <div className={`map-button ${mapData?.new_file ? 'disabled' : ''}`}>
                    <FaCloudDownloadAlt className="icon download" />
                    <div className="title">Download map</div>
                    <div className="subtitle">Download the current map.</div>
                </div>

                <div 
                    className={`map-button ${mapData?.new_file ? 'disabled' : ''}`}
                    onClick={() => handleNavigation('/ControlMobile/Missions')}
                >
                    <FaBook className="icon upload" />
                    <div className="title">Create misson</div>
                    <div className="subtitle">Create a task for robot to work.</div>
                </div>

                <div 
                    className={`map-button ${!mapData?.new_file ? 'disabled' : ''}`}
                    onClick={() => handleNavigation('/ControlMobile/RecordMap')}
                >
                    <BsRecordCircleFill className="icon record" />
                    <div className="title">Record map</div>
                    <div className="subtitle">Record map by moving the robot.</div>
                </div>

                <div 
                    className={`map-button ${mapData?.new_file ? 'disabled' : ''}`}
                    onClick={() => handleNavigation('/ControlMobile/UpdateMap')}
                >
                    <FaSyncAlt className="icon repair" />
                    <div className="title">Update map</div>
                    <div className="subtitle">Edit the map as you like.</div>
                </div>
            </div>
        </div>
    );
};

export default PopupMap;
