// MapContext.js
import { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  const updateSelection = (map, site) => {
    setSelectedMap(map);
    setSelectedSite(site);
  };

  return (
    <MapContext.Provider value={{ selectedMap, selectedSite, updateSelection }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);