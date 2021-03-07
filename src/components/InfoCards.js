import { useState, useEffect } from 'react';
import InfoCard from './InfoCard';
import Spinner from './Spinner';

const InfoCards = () => {
  const [countryData, setCountryData] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [dataType, setDataType] = useState('cases');

  const countryDataAPI = `https://disease.sh/v3/covid-19/countries?yesterday=false&twoDaysAgo=false&sort=${dataType}&allowNull=false`
  const globalDataAPI = 'https://disease.sh/v3/covid-19/all?yesterday=false&twoDaysAgo=false&allowNull=false'

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
    <div className='section info-cards'>
      <div className='infocard-buttons'>
          <button 
            className='blue-grey waves-effect waves-light btn-small'
            onClick={e => setDataType(e.target.value)}
            value='cases'
          >Cases</button>
          <button 
            className='blue-grey waves-effect waves-light btn-small'
            onClick={e => setDataType(e.target.value)}
            value='deaths'
          >Deaths</button>
          <button 
            className='blue-grey waves-effect waves-light btn-small'
            onClick={e => setDataType(e.target.value)}
            value='recovered'
          >Recovered</button>
        </div>
        <div className='card'>
          <div className='info-card-summary pink-text'>Global {dataType} <br/>{globalData[dataType].toLocaleString()}</div>
          {countryData.map(item => <InfoCard key={item.country} country={item.country} figure={item[`${dataType}`]} flag={item.countryInfo.flag} />)}
        </div>
    </div>
  )
}

export default InfoCards;