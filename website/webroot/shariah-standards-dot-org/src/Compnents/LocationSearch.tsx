import { useState } from "react";
import useLocalStorage from 'use-local-storage';
import { MapLocation } from "../Services/PrayerTimesProperies";

export interface LocationSearchProps{
    searchText:string,
    onNewLocationFound:(response:google.maps.GeocoderResult)=>void
}
export const LocationSearch=(props:LocationSearchProps)=>{
	const [mapLocation,setMapLocation] = useLocalStorage<MapLocation|undefined>("ShariahStandards-MapLocation",undefined);

    const [searchText,setSearchText]=useState(props.searchText);
    const [resultsFound,setResultsFound]=useState(false);
    const [searched,setSearched]=useState(false);
    const searchLocation=async ()=>{
        var geocoder = new google.maps.Geocoder();
        var response= await geocoder.geocode({ 'address': searchText });
        setSearched(true);
        if(response && response.results.length>0){
            var topResult=response.results[0];
            setMapLocation({
                latitude:topResult.geometry.location.lat(),
                longitude:topResult.geometry.location.lng(),
                locationName: topResult.formatted_address
            });
            props.onNewLocationFound(response.results[0]);
            setResultsFound(true);
        }else{
            setResultsFound(false);
        }
    }
    return (
    <div>
<input type={"text"} value={searchText} onChange={(event)=> setSearchText(event.target.value)}/>
        <button onClick={()=>searchLocation()}>Search</button>
        {searched && (!resultsFound) && <>No results Found</>}
    </div>);
}