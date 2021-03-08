import { useState, useEffect } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import SwitchTransition from 'react-transition-group/SwitchTransition';
import DrawWorldMap from './DrawWorldMap';
import Spinner from './Spinner';

const mapTopojsonAPI = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';
const covidCountryDataAPI = 'https://disease.sh/v3/covid-19/countries?yesterday=false&twoDaysAgo=false&allowNull=true';
// API DOC: https://corona.lmao.ninja/docs/

const WorldMap = () => {
  const [mapTopojson, setMapTopojson] = useState(null);
  const [countryResults, setCountryResults] = useState(null);
  const [mapType, setMapType] = useState(0);

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
    return <Spinner />;;
  }

  const map = ['cases', 'deaths', 'ratio'];
  const mapTitle = ['Cumulative Cases', 'Cumulative Deaths', 'Case-Fatality Ratio']; 
  const plusSlide = (n) => {
    if (mapType === 0 && n === -1) {
      setMapType(map.length - 1)
    } else if (mapType === map.length - 1 && n === 1) {
      setMapType(0)
    } else {
      setMapType(mapType + n);
    }
  }

  return (
    <div className='worldmap-group'>
      <SwitchTransition>
        <CSSTransition
          key={mapType}
          timeout={200}
          classNames='transition-'
        >
          <DrawWorldMap mapTopojson={mapTopojson} countryResults={countryResults} mapType={map[mapType]}/>
        </CSSTransition>
      </SwitchTransition>
      
      <div className='map-change'>
        <button
          className='arrow' 
          onClick={e => plusSlide(-1)}
        ><i className='material-icons'>chevron_left</i></button>
        
        <SwitchTransition>
          <CSSTransition
            key={mapType}
            timeout={200}
            classNames='transition2-'
          >
            <div className='map-title'>{mapTitle[mapType]}</div>
          </CSSTransition>
        </SwitchTransition>
        
        <button 
          className='arrow' 
          onClick={e => plusSlide(1)}
        ><i className='material-icons'>chevron_right</i></button>
      </div>
    </div>
  );
};

export default WorldMap;