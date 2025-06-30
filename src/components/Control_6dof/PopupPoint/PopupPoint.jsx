import React, { useState, useEffect }  from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import './PopupPoint.css';
import { API_URL } from '@utils/config';


const PopupPoint = (props) => {
    const { 
        ClosePopup,
        joint
    } = props;

    const [paths, setPaths] = useState([])
    const [points, setPoints] = useState([]);
    const [selectPath, setSelectedPath] = useState(null);
    const [selectPoint, setSelectedPoint] = useState(null);
    const [inputName, setInputName] = useState(''); 
    const optionsPath = paths.map(path => ({
      value: path.id,
      label: `${path.id} - ${path.name}`
    }));   
    
    const optionsPoint = points.map(point => ({
      value: point.id,
      label: `${point.id} - ${point.name}`
    }));   

    const fetchLoadData = async (id) => {
        try {
            const response = await fetch(API_URL + "O0007/", {
                method: "GET",
            });
            const data = await response.json();
            setPaths(data);
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
        if(inputName !== '') {
          const response = await fetch(API_URL + "O0028/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id_parent: selectPath.id,
              id: selectPoint.id,
              name: inputName,
              joint: joint,
            })
          });
          const data = await response.json()
          if(data.success){
            toast.success("Successfully save position!", {
              style: {border: '1px solid green'}});
          } else {
            toast.error("Failed to save: " + data.error, {
              style: {border: '1px solid red'}});
          }
          ClosePopup();
        }
        else{
          toast.error("Name point can't empty", {
            style: {border: '1px solid red'}});
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
    <div className="teach-container">
      <div className='teach-header'>
        <div className="teach-title">Save Point Position</div>
      </div>

      <div className="teach-row">
        <label className="teach-label">ID Path - Name</label>
        <Select
          options={optionsPath}
          onChange={async (selectedOption) => {
            const newSelectedPath = paths.find(path => path.id === selectedOption.value);
            setSelectedPath(newSelectedPath);
            await LoadPointInDB(newSelectedPath.id);
          }}
          styles={{
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
              backgroundColor: '#1f2a35',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? '#3c4b5c' : '#2c3e50',
              color: 'white',
              cursor: 'pointer',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',
            }),
          }}
        />
      </div>

      <div className="teach-row">
        <label className="teach-label">ID Point - Name</label>
        <Select
            options={optionsPoint}
            onChange={(selectedOption) => {
                const newSelectedPoint = points.find(point => point.id === selectedOption.value);
                setSelectedPoint(newSelectedPoint);
                setInputName(newSelectedPoint.name);
            }}
            styles={{
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
                    backgroundColor: '#1f2a35',
                }),
                option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#3c4b5c' : '#2c3e50',
                    color: 'white',
                    cursor: 'pointer',
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: 'white',
                }),
            }}
        />
    </div>

      <div className="teach-instruction">
        Select the index you want to save <br/>
        You can change name you want
      </div>

      <div className="teach-row">
        <label className="teach-label">Type here the point name</label>
        <input 
          className="teach-input" 
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="teach-buttons">
        <button 
          className="teach-button teach-teach"
          onClick={handleSave}
        >
          SAVE
        </button>
        <button 
          className="teach-button teach-cancel"
          onClick={ClosePopup}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default PopupPoint;
