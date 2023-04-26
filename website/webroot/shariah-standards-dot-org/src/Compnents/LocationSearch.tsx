import { useState } from "react";
import { MapLocation } from "../Services/PrayerTimesProperies";
import {MdModeEdit} from 'react-icons/md'
import { ActionButton, Input } from "./Wrappers";

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
    
    return (<div style={{padding:10}}>
        {(!props.previouslyFoundMapLocation) &&
    <div  style={{display: "flex", alignItems: "center",justifyContent:"center"}}>
        <Input 
            value={searchText} 
            placeholder={"type a place name"} 
            onChange={(value)=> setSearchText(value)}
            onEnter={()=>searchLocation()}
            />
        {canSearch() && <ActionButton onClick={()=>searchLocation()}>Search</ActionButton>}
        {searched && (!resultsFound) && <>No results Found</>}
    </div>}
        {props.previouslyFoundMapLocation && <div  style={{display: "flex", alignItems: "center",justifyContent:"center"}}>{props.previouslyFoundMapLocation.locationName} <MdModeEdit style={{cursor:"pointer"}} onClick={()=>{props.clearLocation()}}/></div>}
    </div>);
}