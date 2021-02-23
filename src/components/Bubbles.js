import { useState, useEffect } from 'react';
import drawBubbles from '../d3/drawBubbles';

const Bubbles = () => {
  const [countryResults, setCountryResults] = useState([]);
  
  useEffect(() => {
    const fetchData = async() => {
      const response = await fetch('https://corona.lmao.ninja/v2/countries');
      const data = await response.json();
      setCountryResults(data);
    }
    fetchData();
  }, [])

  return (
    <div>
      {drawBubbles(countryResults)}
    </div>
  )
}

export default Bubbles;