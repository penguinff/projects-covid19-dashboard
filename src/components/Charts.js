import { useState, useEffect } from 'react';
import DrawLineChart from './DrawLineChart';
import DrawBarChart from './DrawBarChart';

const Charts = () => {
  const [totalData, setTotalData] = useState(null);
  const [dataType, setdataType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=1000')
      .then(res => res.json())
      .then(data => setTotalData(data));
  }, []);
  
  if (!totalData) {
    return <pre>Loading chart...</pre>;
  }

  return (
    <div className='charts-group section row'>
      <div className='col s12 m12 l6'>
        <DrawLineChart data={totalData} />
      </div>
      <div className='col s12 m12 l6'>
        <DrawBarChart data={totalData} type={dataType} />
        <div className='barchart-buttons'>
          <button 
            className='waves-effect waves-light btn-small'
            onClick={e => setdataType(e.target.value)}
            value='cases'
          >Daily Cases</button>
          <button 
            className='waves-effect waves-light btn-small'
            onClick={e => setdataType(e.target.value)}
            value='deaths'
          >Daily Deaths</button>
        </div>
      </div>
    </div>
  )
}

export default Charts;