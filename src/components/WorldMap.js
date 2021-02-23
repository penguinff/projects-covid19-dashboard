import { useEffect } from 'react';
import DrawWorldMap from '../d3/DrawWorldMap';


const WorldMap = () => {
  useEffect(() => {
    DrawWorldMap();
  }, []);
  
  return (
    <div id="base-worldmap" className='section'>
      <button id="zoom-in">+</button>
      <button id="zoom-out">-</button>
      <button id="reset-map">*</button>
    </div>
  );
};

export default WorldMap;