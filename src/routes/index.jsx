import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from '@features/Login/Login';
import Homepage from '@features/Homepage/Homepage';
import Control6dofRoutes from './6dofRoutes';
import StateSystems from '@features/StateSystems/StateSystems';
import AssignTask from '@features/AssignTask/AssignTask';
import MobileRoutes from './MobileRoutes';

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/6dof/*" element={<Control6dofRoutes />} />
        <Route path="/StateSystems" element={<StateSystems />} />
        <Route path="/AssignTask" element={<AssignTask />} />
        <Route path="/ControlMobile/*" element={< MobileRoutes />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
