import { useState, useEffect, useRef } from 'react';
import drawWorldMap from '../d3/drawWorldMap';
import Bubbles from './Bubbles';

const mapTopojsonAPI = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

const WorldMap = () => {
  const [mapTopojson, setMapTopojson] = useState({});

  useEffect(() => {
    const fetchTopojson = async() => {
      const response = await fetch(mapTopojsonAPI);
      const data = await response.json();
      setMapTopojson(data);
    }
    fetchTopojson();
  }, [])

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      drawWorldMap(mapTopojson);
    }
  })
  
  return (
    <div>
      <div>
        <button id="zoom-in">+</button>
        <button id="zoom-out">-</button>
        <button id="reset-map">*</button>
      </div>
      <div id="base-worldmap" className='section'></div>
      <Bubbles />
    </div>

  );
};

export default WorldMap;