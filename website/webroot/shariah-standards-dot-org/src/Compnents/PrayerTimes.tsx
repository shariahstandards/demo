import React, { useEffect } from 'react'
import { useState } from 'react'
import { prayerTimesForDay } from '../Services/prayerTimesForDay'
import { ShariahstandardsOrgPrayerTimesService } from '../Services/prayerTimesService';
import { MapLocation, PrayerTimesProperties } from '../Services/PrayerTimesProperies'
import useLocalStorage from 'use-local-storage';




export const PrayerTimes = (props: PrayerTimesProperties) => {
	const [prayerTimes, setPrayerTimes] = useState<prayerTimesForDay | undefined>();
	const [mapLocation] = useLocalStorage<MapLocation|undefined>("ShariahStandards-MapLocation",undefined);

	// const [locationName,setLocationName]=useState<string>(props.locationName);
	// const [latitude,setLatitude]=useState<number>(props.latitude);
	// const [longitude,setLongitude]=useState<number>(props.longitude);
	// const [date,setDate]=useState<Date>(new Date());


	useEffect(() => {
		const service = new ShariahstandardsOrgPrayerTimesService();
		service.apiKey = props.googleMapsApiKey;
		const getPrayerTimes = async () => {
			if(mapLocation)
			{
				var p = await service.getPrayerTimes(props.date ?? new Date(), mapLocation.longitude, mapLocation.latitude);
				setPrayerTimes(p);
			}
		}
		getPrayerTimes();
	}, [props,mapLocation])

	return (
		<div>
			{mapLocation && prayerTimes &&
			<>
				<div className="shariahstandards-prayertimes">
					<span className="shariahstandards-prayertimes__location">
						{mapLocation.locationName}   &nbsp;
					</span>
				</div>
				<div>
					<span className="shariahstandards-prayertimes__date">
						{prayerTimes.weekDay} &nbsp; {prayerTimes.simpleDate} &nbsp;
					</span>
				</div>
				<div>
					<span className="shariahstandards-prayertimes__date">
						{prayerTimes.hijriDate.day} &nbsp; 
						{prayerTimes.hijriDate.month.arabicName} &nbsp;
						{prayerTimes.hijriDate.month.englishName} &nbsp;
						{prayerTimes.hijriDate.year} &nbsp;
					</span>
				</div>
				<div>
					<span className="shariahstandards-prayertimes__time-zone">
						{prayerTimes.timeZoneName} ({prayerTimes.timeZoneAbbreviation})
					</span>
					<div style={{ display: 'none' }}>{mapLocation.latitude}, {mapLocation.longitude}</div>
					<div style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<PrayerTime name='Fajr' time={prayerTimes.fajr} />
							<PrayerTime name='Sunrise' time={prayerTimes.sunrise} />
							<PrayerTime name='Zuhr' time={prayerTimes.zuhr} />
							<PrayerTime name='Asr' time={prayerTimes.asr} />
							<PrayerTime name='Maghrib' time={prayerTimes.maghrib} />
							<PrayerTime name='Isha' time={prayerTimes.isha} />
							<div style={{ clear: 'both' }}></div>
						</div>
					</div>
				</div>
				</>}
		</div>
	);
}
export const PrayerTime = (props: { name: string, time: string }) => {
	return (
		<div style={{ padding: 5 }}>
			{props.name} <br /> {props.time}
		</div>)

}