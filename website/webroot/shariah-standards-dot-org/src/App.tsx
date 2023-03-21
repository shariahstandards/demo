import './App.css';
import {PrayerTimes} from './prayer-times/public_api'
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
        <PrayerTimes
          googleMapsApiKey='AIzaSyDkUNGxIGkE0rSqFmbpooGKixa5T5G8G3s'
          latitude={53.4723272}
          longitude={-2.293502}
          locationName={"Manchester, UK"}
          date={new Date()}
        />
      </div>
    </div>
  );
}

export default App;
