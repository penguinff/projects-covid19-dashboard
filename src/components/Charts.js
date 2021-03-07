import { useState, useEffect } from 'react';
import DrawLineChart from './DrawLineChart';
import DrawBarChart from './DrawBarChart';
import Spinner from './Spinner';

const Charts = () => {
  const [totalData, setTotalData] = useState(null);
  const [dataType, setDataType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=1000')
      .then(res => res.json())
      .then(data => setTotalData(data));
  }, []);
  
  if (!totalData) {
    return <Spinner />;
  }

  return (
    <div className='section row charts-group'>
      <div className='col s12 m12 l6'>
        <DrawLineChart data={totalData} />
      </div>
      <div className='col s12 m12 l6'>
        <DrawBarChart data={totalData} type={dataType} />
        <div className='barchart-buttons'>
          <button 
            className='blue-grey waves-effect waves-light btn-small'
            onClick={e => setDataType(e.target.value)}
            value='cases'
          >Daily Cases</button>
          <button 
            className='blue-grey waves-effect waves-light btn-small'
            onClick={e => setDataType(e.target.value)}
            value='deaths'
          >Daily Deaths</button>
        </div>
      </div>
    </div>
  )
}

export default Charts;