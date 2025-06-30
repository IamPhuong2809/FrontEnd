import React, { useState, useEffect }  from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import './Information.css';
import { API_URL } from '@utils/config';


const Information = (props) => {
    const { 
        ClosePopup,
        joint
    } = props;


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

    const [tab, setTab] = useState("Global");
    const [globalPoint, setGlobalPoint] = useState([])
    const [paths, setPaths] = useState([])
    const [points, setPoints] = useState([]);
    const [selectPath, setSelectedPath] = useState(null);
    const [selectPoint, setSelectedPoint] = useState(null);
    const [selectGlobalPoint, setSelectedGlobalPoint] = useState(null);
    const optionsPath = paths.map(path => ({
      value: path.id,
      label: `${path.id} - ${path.name}`
    }));   
    
    const optionsPoint = points.map(point => ({
      value: point.id,
      label: `${point.id} - ${point.name}`
    }));   

    const optionsGlobalPoint = globalPoint.map(point => ({
      value: point.id,
      label: `${point.id} - ${point.name}`
    }));   


    const fetchLoadData = async (id) => {
        try {
          const [resO0006, resO0007] = await Promise.all([
              fetch(API_URL + "O0006/", { method: "GET" }),
              fetch(API_URL + "O0007/", { method: "GET" }),
          ]);

          const dataO0006 = await resO0006.json();
          const dataO0007 = await resO0007.json();
          console.log(dataO0006);
          console.log(dataO0007)
          setGlobalPoint(dataO0006); 
          setPaths(dataO0007); 
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
          const updatedPoints = [
            ...data,
            {
                id: data.length > 0 ? Math.max(...data.map(p => p.id)) + 1 : 1, // Tạo ID mới
                name: "type_a_name"
            }
          ];
          
          setPoints(updatedPoints);
      } catch (error) {
          console.error("Error:", error);
      }
    };

    const handleSave = async () => {
      try {
          // const response = await fetch(API_URL + "O0028/", {
          //   method: "POST",
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({
          //     id_parent: selectPath.id,
          //     id: selectPoint.id,
          //     joint: joint,
          //   })
          // });
          // const data = await response.json()
          // if(data.success){
          //   toast.success("Successfully save position!", {
          //     style: {border: '1px solid green'}});
          // } else {
          //   toast.error("Failed to save: " + data.error, {
          //     style: {border: '1px solid red'}});
          // }
          // ClosePopup();
          if(tab === "Global")
          {
            console.log(selectGlobalPoint);
          }
          else{
            console.log(selectPath, selectPoint);
          }
      } catch (error) {
          console.error("Error:", error);
      }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="copy-container">
      <div className='copy-header'>
        <div className="copy-title">
          Copy Point from 
          
        </div>
      </div>

      <div className="tab-selector">
        <button className={`tab ${tab === "Local" ? "active" : ""}`} onClick={() => setTab("Local")}>Local</button>
        <button className={`tab ${tab === "Global" ? "active" : ""}`} onClick={() => setTab("Global")}>Global</button>
      </div>

      <div className="copy-body">
        {tab === "Local" && (
          <>
            <div className="copy-row">
              <label className="copy-label">ID Path - Name</label>
              <Select
                options={optionsPath}
                onChange={async (selectedOption) => {
                  const newSelectedPath = paths.find(path => path.id === selectedOption.value);
                  setSelectedPath(newSelectedPath);
                  await LoadPointInDB(newSelectedPath.id);
                }}
                styles={customSelectStyles}
              />
            </div>
            <div className="copy-row">
              <label className="copy-label">ID Point - Name</label>
              <Select
                options={optionsPoint}
                onChange={(selectedOption) => {
                  const newSelectedPoint = points.find(point => point.id === selectedOption.value);
                  setSelectedPoint(newSelectedPoint);
                }}
                styles={customSelectStyles}
              />
            </div>
          </>
        )}

        {tab === "Global" && (
          <div className="copy-row">
            <label className="copy-label">ID Point - Name</label>
            <Select
              options={optionsGlobalPoint}
              onChange={(selectedOption) => {
                const newSelectedPoint = globalPoint.find(point => point.id === selectedOption.value);
                setSelectedGlobalPoint(newSelectedPoint);
              }}
              styles={customSelectStyles}
            />
          </div>
        )}
      </div>

      <div className="copy-instruction">
        Select the index you want to copy
      </div>

      <div className="copy-buttons">
        <button 
          className="copy-button copy-save"
          onClick={handleSave}
        >
          SAVE
        </button>
        <button 
          className="copy-button copy-cancel"
          onClick={ClosePopup}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default Information;
