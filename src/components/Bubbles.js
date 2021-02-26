import { useState, useEffect } from 'react';
import drawBubbles from '../d3/drawBubbles';

const Bubbles = () => {
  const covidCountryDataAPI = 'https://corona.lmao.ninja/v2/countries';

  const [countryResults, setCountryResults] = useState([]);
  
  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch(covidCountryDataAPI);
      const data = await response.json();
      setCountryResults(data);
    }
    fetchData();
  }, [])

  return (
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
      {drawBubbles('cases', countryResults)}
    </div>
  )
}

export default Bubbles;