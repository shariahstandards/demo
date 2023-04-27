import { useState } from "react";
import { MapLocation } from "../Services/PrayerTimesProperies";
import {MdModeEdit} from 'react-icons/md'
import { ActionButton, Button, Input } from "./Wrappers";

interface currentLocationListener
{currentLocationFound:(foundLocation:{latitude:number,longitude:number}|null,locationFound:boolean)=>void}

export const GetCurrentLocation = (caller:currentLocationListener)=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(p) {
            console.log(p);
            caller.currentLocationFound({latitude:p.coords.latitude,longitude:p.coords.longitude},true);
        },function(e){
            caller.currentLocationFound(null,true);
        });
    }
}

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
    <div className="flex flex-row justify-center items-center">
        <SearchCurrentLocation onNewLocationFound={props.onNewLocationFound}/>
        <div className="p-2">
            or 
        </div>
        <div>
        <Input 
            value={searchText} 
            placeholder={"type a place name"} 
            onChange={(value)=> setSearchText(value)}
            onEnter={()=>searchLocation()}
            />
        {canSearch() && <ActionButton onClick={()=>searchLocation()}>Search</ActionButton>}
        </div>
        {searched && (!resultsFound) && <>No results Found</>}
    </div>}
        {props.previouslyFoundMapLocation && <div  style={{display: "flex", alignItems: "center",justifyContent:"center"}}>{props.previouslyFoundMapLocation.locationName} <MdModeEdit style={{cursor:"pointer"}} onClick={()=>{props.clearLocation()}}/></div>}
    </div>);
}

export const SearchCurrentLocation=(props:{
    onNewLocationFound:(response:MapLocation)=>void
})=>{

    const [searched,setSearched]=useState(false);
    const [responseReceived,setResponseReceived]=useState(false);
    const [found,setFound]=useState(false);
    const handleSearchCurrentLocation=()=>{
        setSearched(true);
        GetCurrentLocation(listener);
    }
    const listener:currentLocationListener={
        currentLocationFound:async (location,found)=>{
            setResponseReceived(true);
            setFound(found);
            if(found){
                var latlng={lat:location!.latitude, lng:location!.longitude};
                var geocoder = new google.maps.Geocoder();
                var response= await geocoder.geocode({ 'location': latlng });
                if(response && response.results.length>0){
                    var topResult=response.results[0];
                    var newMapLocation={
                        latitude:topResult.geometry.location.lat(),
                        longitude:topResult.geometry.location.lng(),
                        locationName: topResult.formatted_address
                    }
                    props.onNewLocationFound(newMapLocation);
                }else{
                    props.onNewLocationFound({
                        latitude:latlng.lat,
                        longitude:latlng.lng,
                        locationName:"here"
                    });
                }
            }
        }
    }
    return (
        <div>
            {(!searched) && (!responseReceived) &&<Button onClick={handleSearchCurrentLocation}>Here</Button>}
            {searched && (!responseReceived) && <span>waiting for response</span>}
            {responseReceived && <>
                {(!found) && <span>unable to get current location</span> }
                
            </>}
        </div>
    )
}