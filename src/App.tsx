import { useEffect, useState } from "react";
import { Timings, getTimings } from "./api";

function App() {
    const [fajrTime, setFajrTime] = useState<string>("5:00 AM");
    const [maghribTime, setMaghribTime] = useState<string>("6:00 PM");

    useEffect(() => {
        const updateTimings = async () => {
            const currentDate = new Date();
            try {
                const timings = await getTimings(currentDate);
                localStorage.setItem("timings", JSON.stringify({ date: currentDate.toDateString(), timings }));
                setFajrTime(timings.Fajr ?? "4:00 AM");
                setMaghribTime(timings.Maghrib ?? "6:00 PM");
            } catch (error) {
                console.error("Error fetching timings:", error);
            }
        };

        updateTimings();

        const intervalId = setInterval(updateTimings, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const calculateRemainingTime = (targetTime: string): string => {
        const now = currentTime;
        const target = new Date(now.toDateString() + ' ' + targetTime);
        if (target < now) {
            target.setDate(target.getDate() + 1);
        }
        const diff = target.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hours, ${minutes} minutes`;
    };

    return (
        <div>
            <div className="container mx-auto text-center py-4">
                <h1 className="text-3xl font-rocknroll">Islamics</h1>
            </div>

            <div className="container mx-auto">
                <div className="h-83vh text-center flex flex-col gap-4">
                    <div className="bg-zinc-800 bg-opacity-50 rounded-md border-2 border-zinc-700 p-2 flex flex-col justify-center gap-4 flex-grow">
                        <div>
                            <h1 className="text-7xl">Fajr</h1>
                            <h1 className="tracking-wide">{calculateRemainingTime(fajrTime)}</h1>
                        </div>
                    </div>
                    <div className="bg-zinc-800 bg-opacity-50 rounded-md border-2 border-zinc-700 p-2 flex flex-col justify-center gap-4 flex-grow">
                        <div>
                            <h1 className="text-7xl">Maghrib</h1>
                            <h1 className="tracking-wide">{calculateRemainingTime(maghribTime)}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;