// import {timeZoneInfo} from './timeZoneInfo.interface'
import {prayerTimesForDay} from './prayerTimesForDay'
import{hijriDate} from './hijriDate.interface'
import moment from 'moment-timezone';
import { hijriMonth } from './hijriMonth.interface';
declare var require: any;
var SunCalc = require('suncalc');
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
	// change to use https://www.timeapi.io/swagger/index.html
	
    // async getTimeZone(date: Date, latitude: number, longitude: number): Promise<timeZoneInfo> {
    // 	var defaultZoneInfo={rawOffset: 0,	dstOffset: 0,	timeZoneName: "Greewich mean time",	timeZoneId:"GMT",status:"OK"};
    // 	var dateMoment = this._getMiddayMoment(date);
	// 		var url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + latitude + "," + longitude
	// 	 	+ "&timestamp=" + dateMoment.unix()+"&key="+this._apiKey;
	// 		var response = await fetch(url);
	// 		var model=(await response.json()) as timeZoneInfo;
	// 		if(model.status==="ZERO_RESULTS")
	// 		{
	// 			return defaultZoneInfo;
	// 		}
	// 		return model;			
	// };

	//https://www.timeapi.io/api/TimeZone/coordinate?latitude=38.9&longitude=-77.03

	async getPrayerTimes(date:Date,lng:number,lat:number, timeZoneId:string):Promise<prayerTimesForDay> {
		// var zones = moment.tz.names();
        //var timeZone = await this.getTimeZone(date,lat,lng);
		var zone = moment.tz.zone(timeZoneId);//"Europe/London");
		return this.getPrayerTimesForTimeZone(date,zone!,lng,lat)
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
	getHijriDate(latitude: number, longitude: number, date: Date, utcOffset: number): hijriDate {
		var referenceDate = moment.utc("2016-06-20T12:00:00");
		var currentDate = moment(date);
		var testDate=moment(date).toDate();
		var dayCountBack=0;
		var adjustedTimes = this.getAdjustedTimes(latitude,longitude,testDate,utcOffset);
		while(!adjustedTimes.startOfLunarMonth || dayCountBack===0){
			dayCountBack--;
			testDate=moment(testDate).add(-1,"days").toDate();
			adjustedTimes = this.getAdjustedTimes(latitude,longitude,testDate,utcOffset);
		}
		dayCountBack++;//start of lunar month indicates next day is start of lunar month
		var hijriDateDay=1-dayCountBack;
		var daysTo15thOfHijriDateDay = 15-hijriDateDay;
		var fifteenthOfHijriMonthDate = currentDate.add(daysTo15thOfHijriDateDay,"days");
		var daysToReferenceDate = fifteenthOfHijriMonthDate.diff(referenceDate,"days");
		var lunarMonthsSinceReferenceDate = Math.round(daysToReferenceDate /29.5306);
		var referenceDateLunarMonthIndex=8;
		var lunarMonthIndex = (referenceDateLunarMonthIndex+lunarMonthsSinceReferenceDate)%12;
		var hijriMonth = this.hijriMonths[lunarMonthIndex];
		var referenceDateHijriYear=1437;
		var lunarYearsSinceReferenceDay = Math.floor(
			(referenceDateLunarMonthIndex+lunarMonthsSinceReferenceDate)/12.0);
		var hijriYear = referenceDateHijriYear + lunarYearsSinceReferenceDay;
		//if(adjustedTimes.moonVisibilityAtIsha<1 && hijriDateDay==1){

		//}
		return {
			day:hijriDateDay,
			month:hijriMonth,
			year:hijriYear
		}

	}
	hijriMonths:hijriMonth[]=[
	{
		arabicName:'مُحَرَّم',
		phoneticName:'Muḥarram',
		englishName:'Muharram',
		number:1
	},
	{
		arabicName:'صَفَر',
		phoneticName:'Ṣafar',
		englishName:'Safar',
		number:2
	},
	{
		arabicName:'رَبيع الأوّل',
		phoneticName:'Rabī‘ al-awwal',
		englishName:'Rabi al-awwal',
		number:3
	},
	{
		arabicName:'رَبيع الثاني',
		phoneticName:'Rabī‘ ath-thānī',
		englishName:'Rabi athani',
		number:4
	},
	{
		arabicName:'جُمادى الأولى',
		phoneticName:'Jumādá al-ūlá',
		englishName:'Jumada al-ula',
		number:5
	},
	{
		arabicName:'جُمادى الآخرة',
		phoneticName:'Jumādá al-ākhirah',
		englishName:'Ju. al-akhirah',
		number:6
	},
	{	
		arabicName:'رَجَب',
		phoneticName:'Rajab',
		englishName:'Rajab',
		number:7	
	},
	{
		arabicName:'شَعْبان',
		phoneticName:'Sha‘bān',
		englishName:'Shaban',
		number:8
	},
	{
		arabicName:'رَمَضان',
		phoneticName:'Ramaḍān',
		englishName:'Ramadan',
		number:9
	},
	{
		arabicName:'شَوّال',
		phoneticName:'Shawwāl',
		englishName:'Shawwal',
		number:10
	},
	{
		arabicName:'ذو القعدة',
		phoneticName:'Dhū al-Qa‘dah',
		englishName:'Dhu al-Qa\'dah',
		number:11
	},
	{
		arabicName:'ذو الحجة',
		phoneticName:'Dhū al-Ḥijjah',
		englishName:'Dhu al-Hijjah',
		number:12
	}
	]

	
	getPrayerTimesForTimeZone(date:Date,zone:moment.MomentZone,longitude:number,latitude:number):prayerTimesForDay{
		var self = this;
	
		var dateMoment = moment().startOf('d').add(12, 'h');
		if (date != null && moment(date).isValid()) {
			dateMoment = moment(date).startOf('d').add(12, 'h');
		}

		var timestamp=dateMoment.format("x");
		var utcOffset=0-zone.utcOffset(Number(timestamp))/ 60.0;

		SunCalc.addTime(-18, 'fajr', 'isha');
		var times = self.getAdjustedTimes(latitude, longitude, dateMoment.toDate(), utcOffset);
		let result:prayerTimesForDay= {
			//result.moonVisibility=times.moonVisibility;
			//result.startOfLunarMonth= times.startOfLunarMonth;
			//result.date=date;
			//result.isFriday=moment(dateMoment).day()==5;
			simpleDate:moment(dateMoment).format("DD/MM/YYYY"),
			//result.formatedDate=moment(dateMoment).format("Do MMM YYYY");
			weekDay:moment(dateMoment).format("ddd"),
			timeZoneName: zone.name,//timeZone.timeZoneName,
			//timeZoneId: zone.abbr,//timeZone.timeZoneId,
			timeZoneAbbreviation:zone.abbr(Number(timestamp)),//timeZoneAbbreviation,
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
			hijriDate:this.getHijriDate(latitude,longitude,date,utcOffset)
		}
		return result;

	}
}
