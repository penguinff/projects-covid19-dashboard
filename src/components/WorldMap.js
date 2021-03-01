import { useState, useEffect, useRef } from 'react';
import drawWorldMap from '../d3/drawWorldMap';

const mapTopojsonAPI = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';
const covidCountryDataAPI = 'https://corona.lmao.ninja/v3/covid-19/countries';

const WorldMap = () => {
  const [mapTopojson, setMapTopojson] = useState({});
  const [countryResults, setCountryResults] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(mapTopojsonAPI),
      fetch(covidCountryDataAPI)
    ]).then(async([res1, res2]) => {
      const topojson = await res1.json();
      const countrydata = await res2.json();
      return [topojson, countrydata]
    }).then((responseData) => {
      setMapTopojson(responseData[0])
      setCountryResults(responseData[1])
    })
  }, [])

  // ensure drawWorldMap run after set state
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      drawWorldMap(mapTopojson, countryResults);
    }
  }, [countryResults])
  
  return (
    <div>
      <div id="base-worldmap" className='section'></div>
    </div>
  );
};

export default WorldMap;