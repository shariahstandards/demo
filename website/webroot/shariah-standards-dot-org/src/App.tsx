import './App.css';
import { PrayerTimesWithQiblaMap } from './Compnents/PrayerTimesWithQiblaMap'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.svg" width={100} alt="shariah standards"/>
      </header>
      <div style={{fontSize:"20pt"}}>
        Shariah Standards 
      </div>
      <div>
        <PrayerTimesWithQiblaMap 
          googleMapsApiKey='AIzaSyDkUNGxIGkE0rSqFmbpooGKixa5T5G8G3s'        
          date={new Date()} 
        />
      </div>
    </div>
  );
}

export default App;
