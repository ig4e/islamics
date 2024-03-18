import { useEffect, useState } from "react";
import { Timings, getTimings } from "../api";

export const localStorageKey = "timings-v2";

export interface LocalTimings {
	timings: Timings;
	createdAt: Date;
}

async function fetchTimings() {
	const timings = await getTimings();
	localStorage.setItem(localStorageKey, JSON.stringify({ timings, createdAt: new Date() }));

	return timings;
}

export function useTimings() {
	const [timingsState, setTimingsState] = useState<LocalTimings>({
		createdAt: new Date(),
		timings: {
			Fajr: "04:35",
			Sunrise: "06:02",
			Dhuhr: "12:03",
			Asr: "15:28",
			Sunset: "18:04",
			Maghrib: "18:04",
			Isha: "19:34",
			Imsak: "04:25",
			Midnight: "00:03",
			Firstthird: "22:04",
			Lastthird: "02:03",
		},
	});

	useEffect(() => {
		const localTimings = localStorage.getItem(localStorageKey);

		if (localTimings) {
			const parsedTimings = JSON.parse(localTimings);
			const timings: LocalTimings = { timings: parsedTimings.timings, createdAt: new Date(parsedTimings.createdAt) };

			//if timings createdAt is older than 24 hours, fetch new timings
			if (timings.createdAt.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
				fetchTimings().then((data) => {
					setTimingsState({ timings: data, createdAt: new Date() });
				});
			} else {
				setTimingsState(timings);
			}
		} else {
			fetchTimings().then((data) => {
				setTimingsState({ timings: data, createdAt: new Date() });
			});
		}
	}, []);

	return timingsState;
}
