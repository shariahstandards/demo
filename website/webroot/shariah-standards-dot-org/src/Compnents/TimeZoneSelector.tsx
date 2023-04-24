import moment from 'moment-timezone';
import { useState } from 'react';
export const TimeZoneSelector=(props:{
    timeZoneId:string|undefined,
    onTimeZoneIdSelected:(selectedTimeZoneId:string|undefined)=>void
})=>{
    const zones = moment.tz.names();
    const [selectedTimeZone,setSelectedTimeZone]=useState(props.timeZoneId)
	
    const timeZoneSelected=(newValue:string)=>{
        setSelectedTimeZone(newValue);
        if(newValue.length>0){
            props.onTimeZoneIdSelected(newValue);
        }
        else{
            props.onTimeZoneIdSelected(undefined);
        }
    }
    return(
        <div>
            Time Zone: 
            <select value={selectedTimeZone} onChange={(event)=>timeZoneSelected(event.target.value)}>
                <option value={""}>select your time zone</option>
                {zones.map((zone)=>
                    <option key={zone} value={zone}>{zone}</option>)
                }
            </select>
        </div>
    )
}