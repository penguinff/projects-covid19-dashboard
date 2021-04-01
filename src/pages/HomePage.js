import InfoCards from '../components/InfoCards';
import MapChartGroup from '../components/MapChartGroup';

const HomePage = () => {
  return (
    <div className='section row'>
      <div className='col s12 m3 xl2 push-xl1'>
        <InfoCards />
      </div>
      <div className='col s12 m9 xl8 push-xl1'>
        <MapChartGroup />
      </div>
    </div>
  );
}

export default HomePage;