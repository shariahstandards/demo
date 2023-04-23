import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { LocationSearch } from './LocationSearch';
import useLocalStorage from 'use-local-storage';
import { MapLocation } from '../Services/PrayerTimesProperies';

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%"
};


export const QiblaMap=()=> {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey:"AIzaSyDkUNGxIGkE0rSqFmbpooGKixa5T5G8G3s"
  })
  const [mapLocation] = useLocalStorage<MapLocation|undefined>("ShariahStandards-MapLocation",undefined);

  // useEffect(()=>{
  //   if(mapLocation && google){
  //     // setMapCenter(
  //     //   new google.maps.LatLng(mapLocation?.latitude,mapLocation?.longitude));
  //   }
  // },[mapLocation])
  const [map, setMap] = React.useState<google.maps.Map|null>(null)

  const [mapCentre,setMapCenter]=useState<google.maps.LatLng|undefined>()

  const onLoad = React.useCallback(function callback(map:google.maps.Map) {
    setMap(map);
    if(mapLocation){
      console.log(mapLocation);

      setMapCenter(
        new google.maps.LatLng(mapLocation.latitude,mapLocation.longitude));
    }
  }, [])

  const onUnmount = React.useCallback(function callback(map:any) {
    setMap(null);
  }, [])
  
  const setSearchResultOnMap = async (result : google.maps.GeocoderResult)=>{

    setMapCenter(result.geometry.location);
    //self.placeQiblaOnMap();
    // self.getPrayerTimes();
    // self.buildCalendar();
    if(map){ map.setZoom(10); }

  }


  
  return (isLoaded) ? (
    <> 
    <LocationSearch searchText='' onNewLocationFound={setSearchResultOnMap}/>
    <div style={containerStyle}>       
      <GoogleMap
        mapContainerStyle={{width:"50%",height:"500px"}}
        center={mapCentre}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <>{map&& <span style={{display:"none"}}> map object set</span>}</>
      </GoogleMap>
      
      </div>
      {mapLocation && <div>{mapLocation.locationName}</div>}
      </>
  ) : <>
    <br/>
   <LocationSearch searchText='' onNewLocationFound={setSearchResultOnMap}/>
   </>
}
