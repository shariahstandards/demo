import { useEffect } from 'react';
import './tailwind.css';
import './App.css';
// import { PrayerTimesWithQiblaMap } from './Compnents/PrayerTimesWithQiblaMap'
import { useStore } from './Services/Store';
import { Link, Outlet } from 'react-router-dom';
import {MdMenu} from 'react-icons/md'

export const App= ()=> {
  const {load,config} = useStore();
  useEffect(()=>{
    load();
  },[load])

  return (
    <div className="App">
      <header className="App-header" style={{width:"80%", marginLeft:"auto", marginRight:"auto"}}>
        <div className='flex flex-row items-center p-2'>
          <div>
            <Link to={"/"}>
            <img src="/logo.svg" className='h-auto w-24' alt="shariah standards"/>
            </Link>
          </div>
          <div style={{fontSize:"20pt",color:"black",textAlign:"center", flex:1}}>
            Shariah Standards 
          </div>
          <div style={{width:100}}>
            <Link to="/menu">
            <MdMenu style={{fontSize:80,padding:10,paddingLeft:0}}/>
            </Link>
          </div>
        </div>
      </header>
      <div>
        {config &&
        <div id="detail">
          <Outlet/>
        </div>
}
      </div>
    </div>
  );
}

