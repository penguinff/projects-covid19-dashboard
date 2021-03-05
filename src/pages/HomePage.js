import InfoCards from '../components/InfoCards';
import MapChartGroup from '../components/MapChartGroup';
import NewsCards from '../components/NewsCards';

const HomePage = () => {
  return (
    <div className='section row'>
      <div className='col s12 m12 l2'>
        <InfoCards />
      </div>
      <div className='col s12 m12 l8'>
        <MapChartGroup />
      </div>
      <div className='col s12 m12 l2'>
        <NewsCards />
      </div>
    </div>
  );
}

export default HomePage;