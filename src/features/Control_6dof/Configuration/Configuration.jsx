import React, { useState } from 'react';
import './Configuration.css';
import Menu from '@components/Control_6dof/Menu/Menu';
import TaskBar from '@components/Control_6dof/TaskBar/TaskBar';
import HeaderControl from '@components/Control_6dof/Header/Header';
import Input from '@components/Control_6dof/Input/Input';


const Configuration = () => {

    //#region Request data
    const Data_Requests = [
        {   // Load 1
            x: '10.00',
            y: '20.00',
            z: '30.00',
            mass: '4.00',
            jx: '50.00',
            jxy: '60.00',   
            jxz: '70.00',
            jyx: '80.00',
            jy: '90.00',
            jyz: '0.00',
            jzx: '0.00',
            jzy: '0.00',
            jz: '0.00'
        },
        {   // Load 2
            x: '15.00',
            y: '25.00',
            z: '35.00',
            mass: '5.00',
            jx: '55.00',
            jxy: '65.00',   
            jxz: '75.00',
            jyx: '85.00',
            jy: '95.00',
            jyz: '5.00',
            jzx: '5.00',
            jzy: '5.00',
            jz: '5.00'
        },
        {   // Load 3
            x: '20.00',
            y: '30.00',
            z: '40.00',
            mass: '5.40',
            jx: '60.00',
            jxy: '70.00',   
            jxz: '80.00',
            jyx: '90.00',
            jy: '100.00',
            jyz: '10.00',
            jzx: '10.00',
            jzy: '10.00',
            jz: '10.00'
        }
    ];

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
    const [formData, setFormData] = useState(Data_default);
    const handleReset = () => {
        setFormData(Data_default);
    };
    // Update form data
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const title = ['Load 1', 'Load 2', 'Load 3'];
    const [activeTab, setActiveTab] = useState(title[0]);
    const [name, setName] = useState(title[0]);

  //#endregion Main Content

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
                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab(tab);
                        setName(tab);
                        setFormData(Data_Requests[index]);
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
                    onClick={() => console.log(formData)}
                    >Write to Robot</button>
                </div>
            </div>

        </div>
     </div>
    </div>
  );
};

export default Configuration;
