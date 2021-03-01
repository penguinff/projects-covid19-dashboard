import { useState, useEffect } from 'react';
import RenderWorldMap from './RenderWorldMap';

const mapTopojsonAPI = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';
const covidCountryDataAPI = 'https://corona.lmao.ninja/v3/covid-19/countries';

const WorldMap = () => {
  const [mapTopojson, setMapTopojson] = useState(null);
  const [countryResults, setCountryResults] = useState(null);

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
    <RenderWorldMap topoJSONData={mapTopojson} countryResults={countryResults} />
  );
};

export default WorldMap;