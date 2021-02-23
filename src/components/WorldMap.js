import { useEffect } from 'react';
import drawWorldMap from '../d3/drawWorldMap';
import Bubbles from './Bubbles';


const WorldMap = () => {
  useEffect(() => {
    drawWorldMap();
  }, []);
  
  return (
    <div>
      <Bubbles />
      <div id="base-worldmap" className='section'>
        <button id="zoom-in">+</button>
        <button id="zoom-out">-</button>
        <button id="reset-map">*</button>
      </div>
    </div>

  );
};

export default WorldMap;