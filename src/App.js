import Header from './components/Header';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div className='homepage'>
        <HomePage />
      </div>
      <Footer />
    </div>
  );
}

export default App;
