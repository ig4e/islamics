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
    const formattedTimings = {} as Partial<Timings>;
    Object.keys(timings).forEach((key) => {
        const timing = timings[key];
        formattedTimings[key as keyof Timings] = timing;
    });
    return formattedTimings;
}
