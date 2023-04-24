import { useEffect, useState } from 'react';
import './App.css';
import { PrayerTimesWithQiblaMap } from './Compnents/PrayerTimesWithQiblaMap'

interface appConfig{
  googleMapsApiKey:string
}
export const App= ()=> {
  const [config,setConfig] = useState<appConfig|undefined>()
  useEffect(()=>{
    const getConfig = async()=>{
      var response = await fetch("config.json");
      var responseObject =await response.json() as appConfig;
      return responseObject;
    }
    getConfig().then(response=>{
      setConfig(response);
    })
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.svg" width={100} alt="shariah standards"/>
      </header>
      <div style={{fontSize:"20pt"}}>
        Shariah Standards 
      </div>
      <div>
        {config &&
        <PrayerTimesWithQiblaMap 
          googleMapsApiKey={config.googleMapsApiKey}
        />}
      </div>
    </div>
  );
}

