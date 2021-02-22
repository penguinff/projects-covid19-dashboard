import { useEffect } from 'react';
import DrawWorldMap from '../d3/DrawWorldMap';

const WorldMap = () => {
  useEffect(() => {
    DrawWorldMap()
  }, []);
  
  return (
    <div id="base-worldmap"></div>
  );
};

export default WorldMap;