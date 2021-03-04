import { useState, useEffect } from 'react';
import DrawLineChart from './DrawLineChart';

const LineChart = () => {
  const [totalData, setTotalData] = useState(null);
  //https://disease.sh/v3/covid-19/historical/all?lastdays=1000

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=1000')
      .then(res => res.json())
      .then(data => setTotalData(data));
  }, []);
  
  if (!totalData) {
    return <pre>Loading chart...</pre>;
  }

  return (
    <div className='linechart-group'>
      <DrawLineChart data={totalData} />
    </div>
  )
}

export default LineChart;