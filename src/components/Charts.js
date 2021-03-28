import { useState, useEffect } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import SwitchTransition from 'react-transition-group/SwitchTransition';
import DrawLineChart from './DrawLineChart';
import DrawBarChart from './DrawBarChart';
import Spinner from './Spinner';

const Charts = () => {
  const [totalData, setTotalData] = useState(null);
  const [dataType, setDataType] = useState(0);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=1000')
      .then(res => res.json())
      .then(data => setTotalData(data));
  }, []);
  
  if (!totalData) {
    return <Spinner />;
  }

  const barchart = ['cases', 'deaths'];
  const barchartTitle = ['Daily Global Cases', 'Daily Global Deaths']; 
  const plusSlide = (n) => {
    if (dataType === 0 && n === -1) {
      setDataType(barchart.length - 1)
    } else if (dataType === barchart.length - 1 && n === 1) {
      setDataType(0)
    } else {
      setDataType(dataType + n);
    }
  }

  return (
    <div className='section row charts-group'>
      <div className='col s12 m12 l6 line-chart'>
        <DrawLineChart data={totalData} />
      </div>
      <div className='col s12 m12 l6 bar-chart'>
        <SwitchTransition>
          <CSSTransition
            key={dataType}
            timeout={200}
            classNames='transition-'
          >
            <DrawBarChart data={totalData} type={barchart[dataType]} />
          </CSSTransition>
        </SwitchTransition>

        <div className='barchart-change'>
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
              <div className='map-title'>{barchartTitle[dataType]}</div>
            </CSSTransition>
          </SwitchTransition>
          
          <button 
            className='arrow' 
            onClick={e => plusSlide(1)}
          ><i className='material-icons'>chevron_right</i></button>
        </div>
      </div>
    </div>
  )
}

export default Charts;