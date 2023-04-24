import { KeyboardEvent, useState } from "react";
import { MapLocation } from "../Services/PrayerTimesProperies";

export interface LocationSearchProps{
    searchText:string,
    onNewLocationFound:(response:MapLocation)=>void
    clearLocation:()=>void
    previouslyFoundMapLocation:MapLocation|undefined
}
export const LocationSearch=(props:LocationSearchProps)=>{
    const [searchText,setSearchText]=useState(props.searchText);
    const [resultsFound,setResultsFound]=useState(false);
    const [searched,setSearched]=useState(false);
    const canSearch=()=>{
        return searchText.trim().length>0;
    }
    const searchLocation=async ()=>{
        var geocoder = new google.maps.Geocoder();
        var response= await geocoder.geocode({ 'address': searchText });
        setSearched(true);
        if(response && response.results.length>0){
            var topResult=response.results[0];
            var newMapLocation={
                latitude:topResult.geometry.location.lat(),
                longitude:topResult.geometry.location.lng(),
                locationName: topResult.formatted_address
            }
            props.onNewLocationFound(newMapLocation);
            setResultsFound(true);
        }else{
            setResultsFound(false);
        }
    }
    const handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key==="Enter") {
        searchLocation();
      }
    };
    return (<>
        {(!props.previouslyFoundMapLocation) &&
    <div>
        <input 
            type={"text"} 
            value={searchText} 
            placeholder={"type a place name"} 
            onChange={(event)=> setSearchText(event.target.value)}
            onKeyUp={(e)=>handleKeypress(e)}
            />
        {canSearch() && <button onClick={()=>searchLocation()} type={"submit"}>Search</button>}
        {searched && (!resultsFound) && <>No results Found</>}
    </div>}
        {props.previouslyFoundMapLocation && <div>{props.previouslyFoundMapLocation.locationName} <button onClick={()=>{props.clearLocation()}}>X</button></div>}
    </>);
}