import { Route } from "react-router-dom";
import PowerRobot from "../features/Control_6dof/PowerRobot/PowerRobot";
import Configuration from "../features/Control_6dof/Configuration/Configuration";
import TeachPath from "../features/Control_6dof/TeachPath/TeachPath";
import Move from "../features/Control_6dof/Move/Move";
import Information from "../features/Control_6dof/Information/Information";
import MovePath from "../features/Control_6dof/MovePath/MovePath";
import PositionList from "../features/Control_6dof/PositionList/PositionList";


const Control6dofRoutes = () => {
  return (
    <>
      <Route path="/6dof/PowerRobot" element={<PowerRobot />} />
      <Route path="/6dof/Configuration" element={<Configuration />} />
      <Route path="/6dof/TeachPath" element={<TeachPath />} />
      <Route path="/6dof/Move" element={<Move />} />
      <Route path="/6dof/Information" element={<Information />} />
      <Route path="/6dof/MovePath" element={<MovePath />} />
      <Route path="/6dof/PositionList" element={<PositionList />} />

    </>

  );
};

export default Control6dofRoutes;
