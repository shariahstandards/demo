import {timeZoneInfo} from './timeZoneInfo.interface'
import {prayerTimesForDay} from './prayerTimesForDay'
declare var require: any;
var SunCalc = require('suncalc');
var moment = require('moment-timezone');

export class ShariahstandardsOrgPrayerTimesService {

  	_apiKey:string|undefined;
  	set apiKey(value:string){
  		this._apiKey=value;	
  	}

  	_getMiddayMoment(date:Date):any{
    	// throw "not implemented";
		return moment(date).startOf('d').add(12, 'h');
  	}
  	_getResponseObject<T>(response:Response){
  		return response.json() as T;
  	}
    async getTimeZone(date: Date, latitude: number, longitude: number): Promise<timeZoneInfo> {
    	var defaultZoneInfo={rawOffset: 0,	dstOffset: 0,	timeZoneName: "Greewich mean time",	timeZoneId:"GMT",status:"OK"};
    	var dateMoment = this._getMiddayMoment(date);
			var url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + latitude + "," + longitude
		 	+ "&timestamp=" + dateMoment.unix()+"&key="+this._apiKey;
			var response = await fetch(url);
			var model=(await response.json()) as timeZoneInfo;
			if(model.status==="ZERO_RESULTS")
			{
				return defaultZoneInfo;
			}
			return model;			
	};
	async getPrayerTimes(date:Date,lng:number,lat:number):Promise<prayerTimesForDay> {

        var timeZone = await this.getTimeZone(date,lat,lng);
		return this.getPrayerTimesForTimeZone(date,timeZone,lng,lat)
	}
	
	getAdjustedTimes(latitude: number, longitude: number, date: Date, utcOffset: number): any {
		
		var times = SunCalc.getTimes(date, latitude, longitude);
		var originalTimes = SunCalc.getTimes(date, latitude, longitude);
		var fajrIsAdjusted = false;

		if(!moment(originalTimes.fajr).isValid()
			|| moment(originalTimes.solarNoon).diff(moment(originalTimes.fajr), "hours") >= 10) {
			times.fajr = moment(times.solarNoon).subtract(10, "hours").toDate();
			times.isha = moment(times.solarNoon).add(10, "hours").toDate();
			fajrIsAdjusted = true;
		}
		var maghribIsAdjusted = false;
		if ((!moment(originalTimes.sunset).isValid() && !moment(originalTimes.fajr).isValid())
			|| moment(originalTimes.sunset).diff(moment(originalTimes.solarNoon), "hours") >= 9) {
			times.sunrise = moment(times.solarNoon).subtract(9, "hours").toDate();
			times.sunset = moment(times.solarNoon).add(9, "hours").toDate();
			maghribIsAdjusted = true;
		}
		var maghribIsAdjustedLater = false;
		if ((!moment(originalTimes.sunset).isValid() && moment(originalTimes.fajr).isValid())
			|| moment(originalTimes.sunset).diff(moment(originalTimes.solarNoon), "hours") <= 2) {
			times.sunrise = moment(times.solarNoon).subtract(2, "hours").toDate();
			times.sunset = moment(times.solarNoon).add(2, "hours").toDate();
			maghribIsAdjustedLater = true;
		}
		var fajrIsAdjustedEarlier = false;
		
		var noon = moment(times.solarNoon);
		var sunset = moment(times.sunset);
		var minutesDifference = sunset.diff(noon, "minutes");
		var midAfternoon = moment(noon).add(minutesDifference * 2.0 / 3.0, "minutes");
		var timeFormat = "HH:mm";
		var moonAtZuhr = SunCalc.getMoonIllumination(times.solarNoon);
		//if new moon born by noon then could be visible by isha and so this defines a new calendar month
		var zuhr1DaysAgo = moment(times.solarNoon).subtract(1, 'd').toDate();
		var moonAtPreviousZuhr1DaysAgo = SunCalc.getMoonIllumination(zuhr1DaysAgo);
		var startOfLunarMonthToday=(moonAtPreviousZuhr1DaysAgo.phase>moonAtZuhr.phase);
					
		//adding 1 minute to each prayer time to correct for seconds truncation in time format
		//except for sunrise where need to pray before end
		var response =
			{
				//moonVisibility:(moonVisibilityAtIsha*100.0).toFixed(1),
				startOfLunarMonth:startOfLunarMonthToday,
				maghribIsAdjusted: maghribIsAdjusted,
				fajrIsAdjusted: fajrIsAdjusted,
				maghribIsAdjustedLater: maghribIsAdjustedLater,
				fajrIsAdjustedEarlier: fajrIsAdjustedEarlier,
				fajr: moment(times.fajr).utcOffset(utcOffset).add(1,'m').format(timeFormat),
				sunrise: moment(times.sunrise).utcOffset(utcOffset).format(timeFormat),
				zuhr: noon.utcOffset(utcOffset).add(1, 'm').format(timeFormat),
				asr: midAfternoon.utcOffset(utcOffset).add(1, 'm').format(timeFormat),
				maghrib: sunset.utcOffset(utcOffset).add(1, 'm').format(timeFormat),
				isha: moment(times.isha).add(1, 'm').utcOffset(utcOffset).format(timeFormat)
			};

		return response;
	}
	
	getPrayerTimesForTimeZone(date:Date,timeZone:timeZoneInfo,longitude:number,latitude:number):prayerTimesForDay{
		var self = this;
	
		var dateMoment = moment().startOf('d').add(12, 'h');
		if (date != null && moment(date).isValid()) {
			dateMoment = moment(date).startOf('d').add(12, 'h');
		}
		var timestamp=dateMoment.format("x");
		var utcOffset=0-moment.tz.zone(timeZone.timeZoneId).utcOffset(Number(timestamp))/ 60.0;
		var timeZoneAbbreviation=moment.tz.zone(timeZone.timeZoneId).abbr(Number(timestamp));
		//utcOffset = (timeZone.dstOffset + timeZone.rawOffset) / 3600.0;

		SunCalc.addTime(-18, 'fajr', 'isha');
		var times = self.getAdjustedTimes(latitude, longitude, dateMoment.toDate(), utcOffset);
		//var hijriDate:hijriDate =null;
		// if(yesterdayHijri==null){
		// 	hijriDate=this.getHijriDate(latitude, longitude, dateMoment.toDate(), utcOffset);
		// }
		// else{
		// 	if(!yesterDayWasNewMoon)
		// 	{
		// 		hijriDate={
		// 			day:yesterdayHijri.day+1,
		// 			month:yesterdayHijri.month,
		// 			year:yesterdayHijri.year
		// 		}
		// 	}else{
		// 		hijriDate={
		// 				day:1,
		// 				month: this.hijriMonths[yesterdayHijri.month.number%12],
		// 				year:yesterdayHijri.year+Math.floor((yesterdayHijri.month.number/12))
		// 			}
		// 	}
		// }
		var result= {
			//result.moonVisibility=times.moonVisibility;
			//result.startOfLunarMonth= times.startOfLunarMonth;
			//result.date=date;
			//result.isFriday=moment(dateMoment).day()==5;
			simpleDate:moment(dateMoment).format("DD/MM/YYYY"),
			//result.formatedDate=moment(dateMoment).format("Do MMM YYYY");
			weekDay:moment(dateMoment).format("ddd"),
			timeZoneName: timeZone.timeZoneName,
			timeZoneId: timeZone.timeZoneId,
			timeZoneAbbreviation:timeZoneAbbreviation,
			//result.timeZoneChange=false;
			//result.maghribIsAdjusted=times.maghribIsAdjusted;
			//result.maghribIsAdjustedLater=times.maghribIsAdjustedLater;
			//result.fajrIsAdjusted= times.fajrIsAdjusted;
			//result.fajrIsAdjustedEarlier= times.fajrIsAdjustedEarlier;
			//result.times=times;
			fajr:times.fajr,
			sunrise:times.sunrise,
			zuhr:times.zuhr,
			asr:times.asr,
			maghrib:times.maghrib,
			isha:times.isha,
		}
		return result;

	}
}
