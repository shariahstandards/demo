import React, { useEffect } from 'react'
import { useState } from 'react'
import {prayerTimesForDay} from './prayerTimesForDay'
import {ShariahstandardsOrgPrayerTimesService} from './shariahstandards-org-prayer-times.service';

export interface PrayerTimesProperies
{
	googleMapsApiKey:string;
	latitude:number;
	longitude:number;
	date:Date|undefined;
	locationName:string
}
    
export const PrayerTimes=(props:PrayerTimesProperies)=>{
		const [prayerTimes,setPrayerTimes]=useState<prayerTimesForDay|undefined>();
		// const [locationName,setLocationName]=useState<string>(props.locationName);
		// const [latitude,setLatitude]=useState<number>(props.latitude);
		// const [longitude,setLongitude]=useState<number>(props.longitude);
		// const [date,setDate]=useState<Date>(new Date());
		
		useEffect(()=>{
			const service = new ShariahstandardsOrgPrayerTimesService();
			service.apiKey=props.googleMapsApiKey;
			const getPrayerTimes= async ()=> {
				var p=await service.getPrayerTimes(props.date??new Date(),props.longitude,props.latitude);				
				setPrayerTimes(p);
			}
			getPrayerTimes();
		},[props])		
    	 
		return (
		<div>
			{prayerTimes && 
			<div className="shariahstandards-prayertimes">
				<span className="shariahstandards-prayertimes__location">
	 			{props.locationName}   &nbsp;
	 			</span> 
				 <span className="shariahstandards-prayertimes__date">
			 		{prayerTimes.weekDay} &nbsp; {prayerTimes.simpleDate} &nbsp;
		 		</span>
				 <span className="shariahstandards-prayertimes__time-zone">
	 			{prayerTimes.timeZoneName} ({prayerTimes.timeZoneAbbreviation})	
	 		</span> 
			<div style={{display: 'none'}}>{props.latitude}, {props.longitude}</div>
			<div style={{display: 'flex',
        			alignItems: 'center',
        			justifyContent: 'center'}}>
				<div style={{display:'flex', flexDirection: 'row'}}>
					<PrayerTime name='Fajr' time={prayerTimes.fajr}/>
					<PrayerTime name='Sunrise' time={prayerTimes.sunrise}/>
					<PrayerTime name='Zuhr' time={prayerTimes.zuhr}/>
					<PrayerTime name='Asr' time={prayerTimes.asr}/>
					<PrayerTime name='Maghrib' time={prayerTimes.maghrib}/>
					<PrayerTime name='Isha' time={prayerTimes.isha}/>
					<div style={{clear:'both'}}></div>
				</div>
			</div>
			</div>}
		</div>
		);
}
export const PrayerTime=(props:{name:string,time:string})=>{
	return	(
	<div style={{padding:5}}>
		{props.name} <br/> {props.time}
	</div>)
	
}