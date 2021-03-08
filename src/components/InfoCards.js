import { useState, useEffect } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import SwitchTransition from 'react-transition-group/SwitchTransition';
import InfoCard from './InfoCard';
import Spinner from './Spinner';

const InfoCards = () => {
  const [countryData, setCountryData] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [dataType, setDataType] = useState(0);

  let options = { year: 'numeric', month: 'short', day: 'numeric' };

  const data = ['cases', 'deaths', 'recovered'];
  const plusSlide = (n) => {
    if (dataType === 0 && n === -1) {
      setDataType(data.length - 1)
    } else if (dataType === data.length - 1 && n === 1) {
      setDataType(0)
    } else {
      setDataType(dataType + n);
    }
  }

  const countryDataAPI = `https://disease.sh/v3/covid-19/countries?yesterday=false&twoDaysAgo=false&sort=${data[dataType]}&allowNull=false`;
  const globalDataAPI = 'https://disease.sh/v3/covid-19/all?yesterday=false&twoDaysAgo=false&allowNull=false';

  useEffect(() => {
    Promise.all([
      fetch(countryDataAPI),
      fetch(globalDataAPI)
    ]).then(async([res1, res2]) => {
      const countryData = await res1.json();
      const globalData = await res2.json();
      return [countryData, globalData]
    }).then((responseData) => {
      setCountryData(responseData[0])
      setGlobalData(responseData[1])
    })
  }, [dataType]);

  if (!countryData || !globalData) {
    return <Spinner />;
  }

  return (
    <div>
      <p className='last-updated'>Last Updated at: <br/>{new Date(globalData.updated).toLocaleTimeString(undefined,options)}</p>
      <div className='section info-cards'>
        <div className='data-change'>
          <button
            className='arrow' 
            onClick={e => plusSlide(-1)}
          ><i className='material-icons'>chevron_left</i></button>
          
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
            onClick={e => plusSlide(1)}
          ><i className='material-icons'>chevron_right</i></button>
        </div>

        <SwitchTransition>
          <CSSTransition
            key={dataType}
            timeout={200}
            classNames='transition-'
          >
            <div className='card info-cards-scroll'>
              {countryData.map(item => <InfoCard key={item.country} country={item.country} figure={item[data[dataType]]} flag={item.countryInfo.flag} />)}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
    
  )
}

export default InfoCards;