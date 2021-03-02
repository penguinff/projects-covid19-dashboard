import InfoCards from '../components/InfoCards';
import WorldMap from '../components/WorldMap';
import LineChart from '../components/LineChart';

const HomePage = () => {
  return (
    <div>
      <InfoCards />
      <WorldMap />
      <div className='section row'>
        <div className='col s12 m12 l6'>
          <LineChart />
        </div>
        <div className='col s12 m12 l6'>
          <img className='temp-pic'src='https://images.unsplash.com/photo-1614628626351-3ee2c7d7d701?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1301&q=80'/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;