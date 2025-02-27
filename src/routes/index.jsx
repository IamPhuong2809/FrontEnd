import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../features/Login/Login';
import Homepage from '../features/Homepage/Homepage';
import Control6dofRoutes from './6dofRoutes';
import StateSystems from '../features/StateSystems/StateSystems';
import AssignTask from '../features/AssignTask/AssignTask';
import ControlMobile from '../features/ControlMobile/ControlMobile';

function AppRoutes() {
    
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        {Control6dofRoutes()}
        <Route path="StateSystems" element={<StateSystems />} />
        <Route path="AssignTask" element={<AssignTask />} />
        <Route path="ControlMobile" element={<ControlMobile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
