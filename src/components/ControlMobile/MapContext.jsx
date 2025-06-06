// MapContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const savedMap = localStorage.getItem('selectedMap');
    const savedSite = localStorage.getItem('selectedSite');
    
    if (savedMap) setSelectedMap(JSON.parse(savedMap));
    if (savedSite) setSelectedSite(JSON.parse(savedSite));
  }, []);

  const updateSelection = (map, site) => {
    setSelectedMap(map);
    setSelectedSite(site);
    if (map) {
      localStorage.setItem('selectedMap', JSON.stringify(map));
    } else {
      localStorage.removeItem('selectedMap');
    }
    if (site) {
      localStorage.setItem('selectedSite', JSON.stringify(site));
    } else {
      localStorage.removeItem('selectedSite');
    }
  };

  return (
    <MapContext.Provider value={{ selectedMap, selectedSite, updateSelection }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);