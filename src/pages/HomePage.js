import InfoCards from '../components/InfoCards';
import MapChartGroup from '../components/MapChartGroup';
// import NewsCards from '../components/NewsCards';

const HomePage = () => {
  return (
    <div className='section row'>
      <div className='col s12 m12 l2 push-l1'>
        <InfoCards />
      </div>
      <div className='col s12 m12 l8 push-l1'>
        <MapChartGroup />
      </div>
    </div>
  );
}

export default HomePage;

// <div className='col s12 m12 l2'>
//   <NewsCards />
// </div>