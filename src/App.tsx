import { useEffect, useState } from "react";
import { Timings, getTimings } from "./api";

function App() {
	const [timings, setTimings] = useState<Partial<Timings>>({
		Fajr: "5 hours, 39 minutes",
		Maghrib: "19 hours, 8 minutes",
	});

	useEffect(() => {
		getTimings().then((data) => setTimings(data));
	}, []);

	return (
		<div className="">
			<div className="container mx-auto text-center py-4">
				<h1 className="text-2xl">Islamics</h1>
			</div>

			<div className="container mx-auto">
				<div className="flex flex-col gap-4">
					{Object.entries(timings).map(([prayer, time]) => (
						<div className="h-full space-y-24 bg-zinc-800/50 rounded-md border-2 border-zinc-700 p-2" key={prayer}>
							<h1>{prayer}</h1>
							<h1>{time}</h1>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
