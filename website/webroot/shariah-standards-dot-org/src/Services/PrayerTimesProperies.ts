
export interface MapLocation{
	latitude: number;
	longitude: number;
	locationName: string;
}

export interface PrayerTimesProperties extends MapLocation {
	date: Date | undefined;
}
