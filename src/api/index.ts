import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import axios from "axios";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export interface Timings {
	Fajr: string;
	Sunrise: string;
	Dhuhr: string;
	Asr: string;
	Sunset: string;
	Maghrib: string;
	Isha: string;
	Imsak: string;
	Midnight: string;
	Firstthird: string;
	Lastthird: string;
}

async function getAdhan(date = new Date()) {
	const { data } = await axios({
		url: `https://api.aladhan.com/v1/timingsByCity/${`${date.getDate()}-${
			date.getMonth() + 1
		}-${date.getFullYear()}`}?city=cairo&country=egypt&method=5`,
	});

	return data?.data;
}

export async function getTimings(rdate = new Date()) {
	const date = new Date(rdate);
	const { timings } = await getAdhan(date);
	const currentDate = dayjs().tz("Africa/Cairo").startOf("second");

	const timeFromNow = {} as Partial<Timings>;
	Object.keys(timings).forEach((key) => {
		const timing = timings[key];
		const [hour, minute] = timing.split(":");
		let timingDate = dayjs(currentDate).set("hour", hour).set("minute", minute).set("second", 0);

		if (timingDate.isBefore(currentDate)) {
			timingDate = timingDate.add(1, "day");
		}

		const diffMilliseconds = timingDate.diff(currentDate);
		const secondsDiff = Math.floor(diffMilliseconds / 1000);
		const hours = Math.floor(secondsDiff / 3600);
		const minutes = Math.round((secondsDiff % 3600) / 60);

		//@ts-expect-error -- fheh
		timeFromNow[key] = `${hours} hours, ${minutes} minutes`;
	});

	return { Fajr: timeFromNow.Fajr, Maghrib: timeFromNow.Maghrib } as Timings;
}
