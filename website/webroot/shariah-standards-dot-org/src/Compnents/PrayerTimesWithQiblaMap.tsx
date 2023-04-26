import React, { useState } from 'react'
import { MapLocation } from '../Services/PrayerTimesProperies'
import { PrayerTimes } from './PrayerTimes'
import { QiblaMap } from './QiblaMap'
import { LocationSearch } from './LocationSearch';
import { useJsApiLoader } from '@react-google-maps/api';
import useLocalStorage from 'use-local-storage';
// import { TimeZoneSelector } from './TimeZoneSelector';
import { ShariahstandardsOrgPrayerTimesService } from '../Services/prayerTimesService';
import { useStore } from '../Services/Store';
import { Button, PageHeading } from './Wrappers';
import { PageContainer } from './Wrappers/Containers';

export const PrayerTimesWithQiblaMap=()=>{
    const {config}=useStore();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey:config!.googleMapsApiKey
      })
	const [mapLocation,setMapLocation] = useLocalStorage<MapLocation|undefined>("ShariahStandards-MapLocation",undefined);
	const [timeZoneId,setTimeZoneId] = useLocalStorage<string|undefined>("ShariahStandards-TimeZone",undefined);
    const [showQibla,setShowQibla] = useState(false);
    const [shownDate] = useState(new Date());
    const setSearchResultOnMap = async (result : MapLocation, updateTimeZone:boolean)=>{
        setMapLocation(result);
        if(updateTimeZone || !timeZoneId)
        {
            var timeZone=await (new ShariahstandardsOrgPrayerTimesService().getTimeZone(shownDate,result.latitude,result.longitude,config!.googleMapsApiKey));
            if(timeZone){
                setTimeZoneId(timeZone.timeZoneId);
            }
        }

      }
    if(!isLoaded){
        return<div>loading...</div>
    }
    return (<div>
        <PageContainer>
            <PageHeading>Prayer Times and Direction</PageHeading>
        </PageContainer>
        <LocationSearch searchText='' onNewLocationFound={(loc)=>setSearchResultOnMap(loc,true)} previouslyFoundMapLocation={mapLocation} clearLocation={()=>setMapLocation(undefined)}/>
        {/* <TimeZoneSelector onTimeZoneIdSelected={setTimeZoneId} timeZoneId={timeZoneId}/> */}
        
        
        { mapLocation && timeZoneId && <>
            <PrayerTimes 
                date={shownDate} 
                mapLocation={mapLocation} 
                timeZoneId={timeZoneId}
                />
                <div  style={{display: "flex", alignItems: "center",justifyContent:"center"}}>
                {(!showQibla) && <Button onClick={()=>setShowQibla(true)}>Show Qibla</Button>}
                {(showQibla) && <Button onClick={()=>setShowQibla(false)}>Hide Qibla</Button>}

                </div>
            {showQibla &&<QiblaMap mapLocation={mapLocation} onNewLocationFound={loc=>setSearchResultOnMap(loc,false)}/>}
            </>}
        </div>)
}
