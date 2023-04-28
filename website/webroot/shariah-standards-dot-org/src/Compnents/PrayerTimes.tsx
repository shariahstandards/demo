import React, { useEffect } from 'react'
import { useState } from 'react'
import { prayerTimesForDay } from '../Services/prayerTimesForDay'
import { ShariahstandardsOrgPrayerTimesService } from '../Services/prayerTimesService';
import { MapLocation } from '../Services/PrayerTimesProperies'
import { PageContainer } from './Wrappers/Containers';



export const PrayerTimes = (props: {
	date:Date,
	mapLocation:MapLocation,
	timeZoneId:string
}) => {
	const [prayerTimes, setPrayerTimes] = useState<prayerTimesForDay | undefined>();

	// const [locationName,setLocationName]=useState<string>(props.locationName);
	// const [latitude,setLatitude]=useState<number>(props.latitude);
	// const [longitude,setLongitude]=useState<number>(props.longitude);
	// const [date,setDate]=useState<Date>(new Date());


	useEffect(() => {
		const service = new ShariahstandardsOrgPrayerTimesService();
		const getPrayerTimes = async () => {			
			var p = await service.getPrayerTimes(props.date ?? new Date(), props.mapLocation.longitude, props.mapLocation.latitude,props.timeZoneId);
			setPrayerTimes(p);
		}
		getPrayerTimes();
	}, [props.mapLocation,props.date, props.timeZoneId])

	return (
		<div>
			{prayerTimes &&
			<>
				
				<PageContainer>
					<div>
					<span >
						{prayerTimes.weekDay} &nbsp; {prayerTimes.simpleDate} &nbsp;
					</span>
				
					<span className="">
						{prayerTimes.hijriDate.day} &nbsp; 
						{prayerTimes.hijriDate.month.arabicName} &nbsp;
						{prayerTimes.hijriDate.month.englishName} &nbsp;
						{prayerTimes.hijriDate.year} &nbsp;
					</span>
					</div>
					<div>
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
					{prayerTimes.fajrIsAdjusted && 
					<div>
						Fajr and Isha are adjusted for minimum night of 4 hours
					</div>
					}
					{prayerTimes.maghribIsAdjusted && 
					<div>
						Maghrib is adjusted for maximum day of 18 hours
					</div>
					}
					{prayerTimes.maghribIsAdjustedLater && 
					<div>
						Maghrib is adjusted for minimum day of 4 hours
					</div>
					}
					<div>{prayerTimes.timeZoneName} {prayerTimes.timeZoneAbbreviation}</div>
				</PageContainer>
				</>}
		</div>
	);
}
export const PrayerTime = (props: { name: string, time: string }) => {
	return (
		<div style={{ padding: 5,textAlign:"center", backgroundColor:"#ddc",margin:2 }}>
			{props.name} <br /> {props.time}
		</div>)

}