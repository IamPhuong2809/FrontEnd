import React, { useState, useEffect } from 'react';
import './Configuration.css';
import Menu from '@components/Control_6dof/Menu/Menu';
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar';
import HeaderControl from '@components/Header/Header';
import Input from '@components/Control_6dof/Input/Input';
import toast from 'react-hot-toast';
import Loading from '@components/Loading/Loading'

const url = "http://127.0.0.1:8000/api/";

const Configuration = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [title, setTitle] = useState(null);
    const [name, setName] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true); 

    const fetchLoadData = async (id) => {
        try {
            const response = await fetch(url + "O0005/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(id),
            });
            const data = await response.json();
            setFormData(data.dataLoad);
            setTitle(data.nameLoad);
            setName(data.nameLoad[id]);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleWriteToRobot = async () => {
        try {
            const response = await fetch(url + "O0013/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dataLoad: formData,
                    nameLoad: name,
                    id: activeTab
                }),
            });
            fetchLoadData(activeTab);
            const data = await response.json();
            if(data.success){
                toast.success("Successfully save data!", {
                    style: {border: '1px solid green'}});
            } else {
                toast.error("Failed to save: " + data.error, {
                    style: {border: '1px solid red'}});
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    useEffect(() => {
        fetchLoadData(activeTab);
    }, [activeTab]); 

    //#region Main Content
    const Data_default = {
        x: '0.00',
        y: '0.00',
        z: '0.00',
        mass: '0.00',
        jx: '0.00',
        jxy: '0.00',   
        jxz: '0.00',
        jyx: '0.00',
        jy: '0.00',
        jyz: '0.00',
        jzx: '0.00',
        jzy: '0.00',
        jz: '0.00'
    }
    const handleReset = () => {
        setFormData(Data_default);
        toast.success("Data has been reset!", {
            style: {border: '1px solid green'}});
    };
    // Update form data
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    //#endregion Main Content
    if (loading || !title || !formData) {
        return <Loading/>;
      }

  return (
    <div>
      <HeaderControl />
      <Menu/>
      <div className="configuration-robot-container">
        <TaskBar />
        <div className="main-content">
            <div className="tabs">
                {title.map((tab, index) => (
                <button
                    key={tab}
                    className={`tab-button ${activeTab === index ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab(index);
                        setName(title[index]);
                    }}
                >
                    {tab}
                </button>
                ))}
            </div>

            <div className="content">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="section">
                    <h3>Center of mass</h3>
                    <div className="flex-inputs">
                        <Input title="X" formValue={formData.x} maxLength="7" 
                            unit="mm" width="116px" left="77px" onChange={(value) => handleInputChange('x', value)}/>
                        <Input title="Y" formValue={formData.y} maxLength="7" 
                            unit="mm" width="116px" left="77px" onChange={(value) => handleInputChange('y', value)}/>
                        <Input title="Z" formValue={formData.z} maxLength="7" 
                            unit="mm" width="116px" left="77px" onChange={(value) => handleInputChange('z', value)}/>
                        <Input title="Mass" formValue={formData.mass} maxLength="4" 
                            unit="kg" width="73px" left="48px" onChange={(value) => handleInputChange('mass', value)}/>
                    </div>
                </div>

                <div className="section">
                    <h3>Inertia torque</h3>
                    <div className="grid-inputs">
                        <Input title="JXX" formValue={formData.jx} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jx', value)}/>
                        <Input title="JXY" formValue={formData.jxy} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jxy', value)}/>
                        <Input title="JXZ" formValue={formData.jxz} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jxz', value)}/>
                        <Input title="JYX" formValue={formData.jyx} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jyx', value)}/>
                        <Input title="JYY" formValue={formData.jy} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jy', value)}/>
                        <Input title="JYZ" formValue={formData.jyz} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jyz', value)}/>
                        <Input title="JZX" formValue={formData.jzx} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jzx', value)}/>
                        <Input title="JZY" formValue={formData.jzy} maxLength="6" 
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jzy', value)}/>
                        <Input title="JZ" formValue={formData.jz} maxLength="6"
                            unit="kg.m2" width="125px" left="68px" onChange={(value) => handleInputChange('jz', value)}/>
                    </div>
                </div>

                <div className="buttons">
                    <button 
                    className="reset-button"
                    onClick={handleReset}
                    >Reset</button>
                    <button className="write-button"
                    onClick={handleWriteToRobot}
                    >Write to Robot</button>
                </div>
            </div>

        </div>
     </div>
    </div>
  );
};

export default Configuration;
