import { useState, useEffect } from 'react';
import DrawWorldMap from './DrawWorldMap';

const mapTopojsonAPI = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';
const covidCountryDataAPI = 'https://disease.sh/v3/covid-19/countries?yesterday=false&twoDaysAgo=false&allowNull=true';
// API DOC: https://corona.lmao.ninja/docs/

const WorldMap = () => {
  const [mapTopojson, setMapTopojson] = useState(null);
  const [countryResults, setCountryResults] = useState(null);
  const [mapType, setMapType] = useState('cases');

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

  if (!mapTopojson || !countryResults) {
    return <pre>Loading map...</pre>;
  }
  
  return (
    <div className='worldmap-group'>
      <DrawWorldMap mapTopojson={mapTopojson} countryResults={countryResults} mapType={mapType}/>
      <div className='worldmap-buttons'>
        <button 
        className='waves-effect waves-light btn-small'
        onClick={e => setMapType(e.target.value)}
        value='cases'
        >Cumulative Cases</button>
        <button 
          className='waves-effect waves-light btn-small'
          onClick={e => setMapType(e.target.value)}
          value='deaths'
        >Cumulative Deaths</button>
        <button 
          className='waves-effect waves-light btn-small'
          onClick={e => setMapType(e.target.value)}
          value='ratio'
        >Case-Fatality Ratio</button>
      </div>
    </div>
  );
};

export default WorldMap;