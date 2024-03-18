import { useCallback, useEffect, useState } from "react";
import { useTimings } from "./hooks/use-timings";

function App() {
	const { timings, createdAt } = useTimings();
	const [clock, setClock] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setClock(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	const calculateRemainingTime = useCallback(
		(targetTime: string): string => {
			const now = new Date(clock);
			const target = new Date(now.toDateString() + " " + targetTime);
			if (target < now) {
				target.setDate(target.getDate() + 1);
			}
			const diff = target.getTime() - now.getTime();
			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			return `${hours} hours, ${minutes} minutes`;
		},
		[clock],
	);

	return (
		<div>
			<div className="container mx-auto text-center py-4 space-y-2">
				<h1 className="text-3xl font-rocknroll">Islamics</h1>
				<p>
					Last update: {createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString()}
				</p>
			</div>

			<div className="container mx-auto">
				<div className="h-83vh text-center flex flex-col gap-4">
					<div className="bg-zinc-800 bg-opacity-50 rounded-md border-2 border-zinc-700 p-2 flex flex-col justify-center gap-6 flex-grow">
						<h1 className="text-7xl">Fajr</h1>
						<h1 className="tracking-wide text-lg">{calculateRemainingTime(timings.Fajr)}</h1>
					</div>
					<div className="bg-zinc-800 bg-opacity-50 rounded-md border-2 border-zinc-700 p-2 flex flex-col justify-center gap-6 flex-grow">
						<h1 className="text-7xl">Maghrib</h1>
						<h1 className="tracking-wide text-lg">{calculateRemainingTime(timings.Maghrib)}</h1>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
