import { Routes, Route } from "react-router-dom";
import PowerRobot from "@features/Control_6dof/PowerRobot/PowerRobot";
import Configuration from "@features/Control_6dof/Configuration/Configuration";
import TeachPath from "@features/Control_6dof/TeachPath/TeachPath";
import Move from "@features/Control_6dof/Move/Move";
import Information from "@features/Control_6dof/Information/Information";
import MovePath from "@features/Control_6dof/MovePath/MovePath";
import PositionList from "@features/Control_6dof/PositionList/PositionList";
import { ReceiveRobotData } from '@components/Control_6dof/RobotData';

const Control6dofRoutes = () => {
  return (
    <ReceiveRobotData>  
      <Routes>
        <Route path="/PowerRobot" element={<PowerRobot />} />
        <Route path="/Configuration" element={<Configuration />} />
        <Route path="/TeachPath" element={<TeachPath />} />
        <Route path="/Move" element={<Move />} />
        <Route path="/Information" element={<Information />} />
        <Route path="/MovePath" element={<MovePath />} />
        <Route path="/PositionList" element={<PositionList />} />
      </Routes>
    </ReceiveRobotData>
  );
};

export default Control6dofRoutes;
