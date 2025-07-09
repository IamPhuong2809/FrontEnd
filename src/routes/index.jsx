import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from '@features/Login/Login';
import Homepage from '@features/Homepage/Homepage';
import Control6dofRoutes from './6dofRoutes';
import StateSystems from '@features/StateSystems/StateSystems';
import AssignTask from '@features/AssignTask/AssignTask';
import MobileRoutes from './MobileRoutes';
import { ReceiveRobotData } from '@components/Control_6dof/RobotData';

function AppRoutes() {
  return (
    <HashRouter>
    <ReceiveRobotData>  
    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/6dof/*" element={<Control6dofRoutes />} />
        <Route path="/StateSystems" element={<StateSystems />} />
        <Route path="/AssignTask" element={<AssignTask />} />
        <Route path="/ControlMobile/*" element={< MobileRoutes />} />
      </Routes>
    </ReceiveRobotData>  
    </HashRouter>
  );
}

export default AppRoutes;
