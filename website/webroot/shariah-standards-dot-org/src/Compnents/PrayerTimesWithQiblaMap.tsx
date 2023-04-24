import React, { useState } from 'react'
import { MapLocation } from '../Services/PrayerTimesProperies'
import { PrayerTimes } from './PrayerTimes'
import { QiblaMap } from './QiblaMap'
import { LocationSearch } from './LocationSearch';
import { useJsApiLoader } from '@react-google-maps/api';
import useLocalStorage from 'use-local-storage';
// import { TimeZoneSelector } from './TimeZoneSelector';
import { ShariahstandardsOrgPrayerTimesService } from '../Services/prayerTimesService';




    export const PrayerTimesWithQiblaMap=(props:{ googleMapsApiKey: string;})=>{
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey:props.googleMapsApiKey
      })
	const [mapLocation,setMapLocation] = useLocalStorage<MapLocation|undefined>("ShariahStandards-MapLocation",undefined);
	const [timeZoneId,setTimeZoneId] = useLocalStorage<string|undefined>("ShariahStandards-TimeZone",undefined);
    const [showQibla,setShowQibla] = useState(false);
    const [shownDate,setShownDate] = useState(new Date());
    const setSearchResultOnMap = async (result : MapLocation, updateTimeZone:boolean)=>{
        setMapLocation(result);
        if(updateTimeZone || !timeZoneId)
        {
            var timeZone=await (new ShariahstandardsOrgPrayerTimesService().getTimeZone(shownDate,result.latitude,result.longitude,props.googleMapsApiKey));
            if(timeZone){
                setTimeZoneId(timeZone.timeZoneId);
            }
        }

      }
    if(!isLoaded){
        return<div>loading...</div>
    }
    return (<div>
        <LocationSearch searchText='' onNewLocationFound={(loc)=>setSearchResultOnMap(loc,true)} previouslyFoundMapLocation={mapLocation} clearLocation={()=>setMapLocation(undefined)}/>
        {/* <TimeZoneSelector onTimeZoneIdSelected={setTimeZoneId} timeZoneId={timeZoneId}/> */}
        
        
        { mapLocation && timeZoneId && <>
            <PrayerTimes 
                date={shownDate} 
                mapLocation={mapLocation} 
                timeZoneId={timeZoneId}
                />
                {(!showQibla) && <button style={{margin:20}} onClick={()=>setShowQibla(true)}>Show Qibla</button>}
                {(showQibla) && <button style={{margin:20}}onClick={()=>setShowQibla(false)}>Hide Qibla</button>}
            {showQibla &&<QiblaMap mapLocation={mapLocation} onNewLocationFound={loc=>setSearchResultOnMap(loc,false)}/>}
            </>}
        </div>)
}