import React, { useState, useEffect }  from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import './PopupGlobal.css';
import { API_URL } from '@utils/config';

const PopupGlobal = (props) => {
    const { 
        ClosePopup,
        joint
    } = props;

    const [points, setPoints] = useState([]);
    const [selectPoint, setSelectedPoint] = useState(null);
    const [inputName, setInputName] = useState(''); 
    const options = points.map(point => ({
      value: point.id,
      label: `${point.id} - ${point.name}`
    }));    

    const fetchLoadData = async (id) => {
        try {
            const response = await fetch(API_URL + "O0006/", {
                method: "GET",
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

    useEffect(() => {
        fetchLoadData();
    }, []); 

    const handleSave = async () => {
      try {
        if(inputName === ''){
          toast.error("Name point can't empty", {
            style: {border: '1px solid red'}});
        }
        else if(selectPoint === null){
          toast.error("You need to select the ID", {
            style: {border: '1px solid red'}});
        }
        else{
          const response = await fetch(API_URL + "O0027/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
        <div className="teach-title">Save Global Position</div>
      </div>

      <div className="teach-row">
        <label className="teach-label">ID - Name</label>
        <Select
          options={options}
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

export default PopupGlobal;
