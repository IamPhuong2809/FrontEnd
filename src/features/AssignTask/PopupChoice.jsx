import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
// import { API_URL } from '@utils/config';
import './PopupChoice.css'
const API_URL = "http://196.169.2.212:8000/api/";


const PopupChoice = ({ AddAction, ClosePopup }) => {
    const [tab, setTab] = useState("Mobile");
    const [sites, setSites] = useState([]);
    const [maps, setMaps] = useState([]);
    const [positions, setPositions] = useState([]);
    const [arucoIds, setArucoIds] = useState([]);
  
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedMap, setSelectedMap] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedArucoId, setSelectedArucoId] = useState(null);
    const [selectedGrip, setSelectedGrip] = useState(null);

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#2c3e50',
            borderColor: '#34495e',
            color: 'white',
            marginTop: '5px',
        }),
        input: (provided) => ({
            ...provided,
            color: 'white',
            margin: '0px',
            padding: '0px',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#003549',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#006991' : '#003549',
            color: 'white',
            cursor: 'pointer',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),
    };

    const optionsSites = sites.map(site => ({ value: site.id, label: `${site.id} - ${site.name}`}));

    const optionsMaps = maps.map(map => ({ value: map.id, label: map.name }));

    const optionsPositions = positions.map(pos => ({ value: pos.id, label: `${pos.id} - ${pos.name}` }));

    const optionsArucoIds = arucoIds.map(item => ({ value: item.id, label: `Aruco Id: ${item.id}` }));

    const gripOptions = [
      { value: "pick", label: "Pick" },
      { value: "place", label: "Place" }
    ];
    const fetchLoadData = async () => {
        try {
            const [res_O0031, res_aruco_id] = await Promise.all([
                fetch(API_URL + "O0031/"),
                fetch(API_URL + "aruco_id/"),
            ]);

            const data_O0031 = await res_O0031.json();
            const data_aruco_id = await res_aruco_id.json();
            setSites(data_O0031);
            setArucoIds(data_aruco_id);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchLoadData();
    }, []);

    const LoadMapInDB = async (id) => {
        try {
            const response = await fetch(API_URL + "map/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type: null })
            });
            const data = await response.json();
            setMaps(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const LoadPositionInDB = async (id) => {
        try {
            const response = await fetch(API_URL + "position_mobile/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_site: selectedSite.id, id })
            });
            const data = await response.json();
            setPositions(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSave = async () => {
        try {
            // const payload = {
            //     idCopy: PointCopy.id,
            //     idPathCopy: IdPathCopy,
            //     type: tab,
            //     ...(tab === "Global"
            //         ? { id: selectGlobalPoint.id }
            //         : { idPath: selectPath.id, id: selectPoint.id }
            //     )
            // };

            // const response = await fetch(API_URL + "copy/", {
            //     method: "POST",
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });

            // const data = await response.json();
            // if (data.success) {
            //     toast.success("Successfully copy position!", {
            //         style: { border: '1px solid green' }
            //     });
            // } else {
            //     toast.error("Failed to copy: " + data.error, {
            //         style: { border: '1px solid red' }
            //     });
            // }

            // setTimeout(() => {
            //     localStorage.setItem("selected_path", JSON.stringify(IdPathCopy));
            //     localStorage.setItem("selected_point", JSON.stringify(PointCopy));
            //     window.location.reload();
            // }, 800);

            // setShowPopupChoice(false);
            let newAction;
            if(tab === 'Mobile'){
                newAction = {
                    type: 1,
                    data: 
                    {
                        pos: selectedPosition.name,
                        map: selectedMap.name,
                        site: selectedSite.name,
                        
                    }
                };
            }
            else{
                newAction = {
                    type: 2,
                    data: 
                    {
                        id: selectedArucoId.id,
                        grip: selectedGrip,
                    }
                };
            }
            console.log(newAction)
            AddAction(newAction);
            ClosePopup();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="action-form-container">
            <div className='action-form-header'>
                <div className="action-form-title">
                    Add Action to control <span className="highlight-name">Robot</span>
                </div>
            </div>

            <div className="action-form-tab-selector">
                <button className={`action-form-tab ${tab === "Mobile" ? "active" : ""}`} onClick={() => setTab("Mobile")}>Mobile</button>
                <button className={`action-form-tab ${tab === "Manipulator" ? "active" : ""}`} onClick={() => setTab("Manipulator")}>Manipulator</button>
            </div>

            <div className="action-form-body">
                {tab === "Mobile" && (
                <>
                    <div className="action-form-row">
                        <label className="action-form-label">Site</label>
                        <Select
                            options={optionsSites}
                            onChange={async (option) => {
                                const site = sites.find(s => s.id === option.value);
                                setSelectedSite(site);
                                await LoadMapInDB(site.id)
                            }}
                            styles={customSelectStyles}
                        />
                    </div>

                    <div className="action-form-row">
                        <label className="action-form-label">Map</label>
                        <Select
                            options={optionsMaps}
                            onChange={async (option) => {
                                const map = maps.find(m => m.id === option.value);
                                setSelectedMap(map);
                                await LoadPositionInDB(map.id)
                            }}
                            styles={customSelectStyles}
                        />
                    </div>

                    <div className="action-form-row">
                        <label className="action-form-label">Position</label>
                        <Select
                            options={optionsPositions}
                            onChange={(option) => {
                                const pos = positions.find(p => p.id === option.value);
                                setSelectedPosition(pos);
                            }}
                            styles={customSelectStyles}
                        />
                    </div>
                </>
                )}

                {tab === "Manipulator" && (
                <>
                    <div className="action-form-row">
                    <label className="action-form-label">Aruco ID</label>
                    <Select
                        options={optionsArucoIds}
                        onChange={(option) => {
                        const aruco = arucoIds.find(p => p.id === option.value);
                            setSelectedArucoId(aruco);
                        }}
                        styles={customSelectStyles}
                    />
                    </div>

                    <div className="action-form-row">
                    <label className="action-form-label">Grip</label>
                    <Select
                        options={gripOptions}
                        onChange={(option) => setSelectedGrip(option.label)}
                        styles={customSelectStyles}
                    />
                    </div>
                </>
                )}
            </div>

            <div className="action-form-instruction">Select the index you want to create action</div>

            <div className="action-form-buttons">
                <button className="action-form-button action-form-save" onClick={handleSave}>
                    SAVE
                </button>
                <button className="action-form-button action-form-cancel" onClick={() => ClosePopup()}>
                    CANCEL
                </button>
            </div>
        </div>
    );
};

export default PopupChoice;
