import React from 'react'
import { PrayerTimesProperties } from '../Services/PrayerTimesProperies'
import { PrayerTimes } from './PrayerTimes'
import { QiblaMap } from './QiblaMap'


export const PrayerTimesWithQiblaMap=(props:PrayerTimesProperties)=>{

    return (<div>
        <PrayerTimes {...props}/>
        <QiblaMap/>
        </div>)
}