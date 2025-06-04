import { Routes, Route } from "react-router-dom";
import PowerMobile from "@features/ControlMobile/PowerMobile/PowerMobile";
import Maps from "@features/ControlMobile/Maps/Maps";
import Missions from "@features/ControlMobile/Missions/Missions";
import UpdateMap from "@features/ControlMobile/UpdateMap/UpdateMap";
import Information from "@features/ControlMobile/Information/Information";
import RecordMap from "@features/ControlMobile/RecordMap/RecordMap";
// import PositionList from "@features/Control_6dof/PositionList/PositionList";
import { ReceiveRobotData } from '@components/Control_6dof/RobotData';
import { MapProvider } from '@components/ControlMobile/MapContext';

const ControlMobile = () => {
  return (
    <ReceiveRobotData>
      <MapProvider>
        <Routes>
          <Route path="/PowerMobile" element={<PowerMobile />} />
          <Route path="/Maps" element={<Maps />} />
          <Route path="/RecordMap" element={<RecordMap />} />
          <Route path="/Missions" element={<Missions />} />
          <Route path="/UpdateMap" element={<UpdateMap />} />
          <Route path="/Information" element={<Information />} />
        </Routes>
      </MapProvider>
    </ReceiveRobotData>
  );
};

export default ControlMobile;
