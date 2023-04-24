import React from 'react'
import { MapLocation } from '../Services/PrayerTimesProperies'
import { PrayerTimes } from './PrayerTimes'
import { QiblaMap } from './QiblaMap'
import { LocationSearch } from './LocationSearch';
import { useJsApiLoader } from '@react-google-maps/api';
import useLocalStorage from 'use-local-storage';
import { TimeZoneSelector } from './TimeZoneSelector';




    export const PrayerTimesWithQiblaMap=(props:{ googleMapsApiKey: string;})=>{
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey:props.googleMapsApiKey
      })
	const [mapLocation,setMapLocation] = useLocalStorage<MapLocation|undefined>("ShariahStandards-MapLocation",undefined);
	const [timeZoneId,setTimeZoneId] = useLocalStorage<string|undefined>("ShariahStandards-TimeZone",undefined);

    const setSearchResultOnMap = async (result : MapLocation)=>{
        setMapLocation(result);
      }
    if(!isLoaded){
        return<div>loading...</div>
    }
    return (<div>
        <LocationSearch searchText='' onNewLocationFound={setSearchResultOnMap} previouslyFoundMapLocation={mapLocation} clearLocation={()=>setMapLocation(undefined)}/>
        <TimeZoneSelector onTimeZoneIdSelected={setTimeZoneId} timeZoneId={timeZoneId}/>
        
        
        {mapLocation && timeZoneId && <>
            <PrayerTimes 
                date={new Date()} 
                mapLocation={mapLocation} 
                googleMapsApiKey={props.googleMapsApiKey} 
                timeZoneId={timeZoneId}
                />
            <QiblaMap mapLocation={mapLocation} onNewLocationFound={setSearchResultOnMap}/>
            </>}
        </div>)
}