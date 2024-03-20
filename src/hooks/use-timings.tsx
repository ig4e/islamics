import { useEffect, useState } from "react";
import Localbase from "localbase";
import { Timings, getTimings } from "../api";

const localbase = new Localbase("timingsDB");

export interface LocalTimings {
    timings: Timings;
    createdAt: Date;
    id?: number; // Add id property
}

async function fetchTimingsForWeek(): Promise<void> {
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + i);
        const timings = await getTimings(date);
        const localTimings: LocalTimings = {
            timings,
            createdAt: new Date(),
        };
        saveToLocalbase(localTimings, date); // Save timings to Localbase with date as key
    }
}

function saveToLocalbase(data: LocalTimings, date: Date) {
    const key = date.toISOString().slice(0, 10); // Use date as key
    const dataWithId: LocalTimings = { ...data, id: Number(key) }; // Add ID to the data
    localbase.collection("timings").doc(key).set(dataWithId);
}

export function useTimings() {
    const [timingsState, setTimingsState] = useState<LocalTimings | null>(null);

    useEffect(() => {
        const currentDate = new Date();
        const key = currentDate.toISOString().slice(0, 10); // Use current date as key

        localbase.collection("timings").doc(key).get().then((data: LocalTimings | null) => {
            if (data) {
                setTimingsState(data);
            } else {
                const isOnline = navigator.onLine;
                if (isOnline) {
                    fetchAndSaveTimings(currentDate);
                } else {
                    console.log("Website is offline. Skipping database update.");
                }
            }
        });

        // Cleanup function
        return () => {
            // Cleanup code if needed
        };
    }, []);

    const fetchAndSaveTimings = async (date: Date) => {
        try {
            await fetchTimingsForWeek();
            const key = date.toISOString().slice(0, 10); // Use date as key
            const data = await localbase.collection("timings").doc(key).get();
            if (data) {
                setTimingsState(data);
            }
        } catch (error) {
            console.error("Error fetching and updating data:", error);
        }
    };

    return timingsState;
}