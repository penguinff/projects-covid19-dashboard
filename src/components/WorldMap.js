import { useState, useEffect, useRef } from 'react';
import drawWorldMap from '../d3/drawWorldMap';
// import Bubbles from './Bubbles';
import drawBubbles from '../d3/drawBubbles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const mapTopojsonAPI = 'https://unpkg.com/world-atlas@1.1.4/world/50m.json';
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
      // console.log(responseData);
      setMapTopojson(responseData[0])
      setCountryResults(responseData[1])
    })
    // const fetchTopojson = async() => {
    //   const response = await fetch(mapTopojsonAPI);
    //   const data = await response.json();
    //   setMapTopojson(data);
    // }
    // fetchTopojson();
  }, [])

  // useEffect(() => {
  //   const fetchData = async() => {
  //     const response = await fetch(covidCountryDataAPI);
  //     const data = await response.json();
  //     setCountryResults(data);
  //   }
  //   fetchData();
  // }, [])

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      drawWorldMap(mapTopojson, countryResults);
      // drawBubbles('cases', countryResults);
    }
  }, [countryResults])

  // const mapTypeArray = ['cases', 'active', 'casesPerOneMillion', 'todayCases', 'todayDeaths'];
  
  return (
    <div>
      <div id="base-worldmap" className='section'></div>
      <div>
        <button 
          onClick={e => drawBubbles(e.target.value, countryResults)}
          value='cases'
        >Cumulative Cases</button>
        <button 
          onClick={e => drawBubbles(e.target.value, countryResults)}
          value='active'
        >Active Cases</button>
        <button 
          onClick={e => drawBubbles(e.target.value, countryResults)}
          value='casesPerOneMillion'
        >Cases per one million</button>
        <button
          onClick={e => drawBubbles(e.target.value, countryResults)} 
          value='todayCases'
        >Today Cases</button>
        <button 
          onClick={e => drawBubbles(e.target.value, countryResults)} 
          value='todayDeaths'
        >Today Deaths</button>
      </div>
    </div>

  );
};

export default WorldMap;