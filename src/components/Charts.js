import { useState, useEffect } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import SwitchTransition from 'react-transition-group/SwitchTransition';
import DrawLineChart from './DrawLineChart';
import DrawBarChart from './DrawBarChart';
import Spinner from './Spinner';

const Charts = () => {
  // local state
  const [totalData, setTotalData] = useState(null);
  const [dataType, setDataType] = useState(0);

  // fetch covid-19 global daily cumulative cases data in first render
  useEffect(() => {
    const fetchGlobalCumulative = async () => {
      const res = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=1000');
      const data = await res.json();
      setTotalData(data);
    };
    fetchGlobalCumulative();
  }, []);
  
  // define a function to control change of bar chart type
  const barchart = ['cases', 'deaths'];
  const barchartTitle = ['Daily Global Cases', 'Daily Global Deaths']; 
  const plusSlide = (n) => {
    if (dataType === 0 && n === -1) {
      setDataType(barchart.length - 1)
    } else if (dataType === barchart.length - 1 && n === 1) {
      setDataType(0)
    } else {
      setDataType(dataType => dataType + n);
    }
  }

  // display spinner if totalData is not ready
  if (!totalData) {
    return <Spinner />;
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
              <div className='mapchart-title'>{barchartTitle[dataType]}</div>
            </CSSTransition>
          </SwitchTransition>
          
          <button 
            className='arrow' 
            onClick={() => plusSlide(1)}
          >
            <i className='material-icons'>chevron_right</i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Charts;