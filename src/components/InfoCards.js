import { useState, useEffect } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import SwitchTransition from 'react-transition-group/SwitchTransition';
import InfoCard from './InfoCard';
import Spinner from './Spinner';

const InfoCards = () => {
  // local state
  const [countryData, setCountryData] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [dataType, setDataType] = useState(0);

  // customize the date time format
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour12: true };

  // define a function to control change of data type
  const data = ['cases', 'deaths', 'recovered'];
  const plusSlide = (n) => {
    if (dataType === 0 && n === -1) {
      setDataType(data.length - 1)
    } else if (dataType === data.length - 1 && n === 1) {
      setDataType(0)
    } else {
      setDataType(dataType => dataType + n);
    }
  }

  // API for global and country data
  const sortedCountryDataAPI = `https://disease.sh/v3/covid-19/countries?yesterday=false&twoDaysAgo=false&sort=${data[dataType]}&allowNull=false`;
  const globalDataAPI = 'https://disease.sh/v3/covid-19/all?yesterday=false&twoDaysAgo=false&allowNull=false';

  // fetch global data in first render
  useEffect(() => {
    const fetchGlobalData = async () => {
      let res = await fetch(globalDataAPI);
      let data = await res.json();
      setGlobalData(data);
    };
    fetchGlobalData();
  }, [])

  // fetch country data in first render & every time the dataType changes (use the sorted data from API)
  useEffect(() => {
    const fetchCountryData = async () => {
      let res = await fetch(sortedCountryDataAPI);
      let data = await res.json();
      setCountryData(data);
    };
    fetchCountryData();
  }, [sortedCountryDataAPI])

  // display spinner if countryData / globalData is not ready
  if (!countryData || !globalData) {
    return <Spinner />;
  }

  return (
    <div>
      <p className='last-updated'>Last Updated at: <br/>{new Date(globalData.updated).toLocaleTimeString('en-US', options)}</p>
      
      <div className='section info-cards'>
        <div className='data-change'>
          <button
            className='arrow' 
            onClick={() => plusSlide(-1)}
          >
            <i className='material-icons'>chevron_left</i>
          </button>
          
          <SwitchTransition>
            <CSSTransition
              key={dataType}
              timeout={200}
              classNames='transition2-'
            >
              <div className='info-card-summary pink-text'>Global {data[dataType]} <br/>{(globalData[data[dataType]]).toLocaleString()}</div>
            </CSSTransition>
          </SwitchTransition>
          
          <button 
            className='arrow' 
            onClick={() => plusSlide(1)}
          >
            <i className='material-icons'>chevron_right</i>
          </button>
        </div>

        <SwitchTransition>
          <CSSTransition
            key={dataType}
            timeout={200}
            classNames='transition-'
          >
            <div className='info-cards-scroll'>
              {countryData.map(item => <InfoCard key={item.country} country={item.country} figure={item[data[dataType]]} flag={item.countryInfo.flag} />)}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  )
}

export default InfoCards;