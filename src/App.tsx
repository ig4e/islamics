import React, { useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
      // Request permission for notifications
      Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
          // Permission granted, display notification
          var notification = new Notification("Push notification granted!", {
            body: "You will now receive notifications."
          });
        } else if (permission === "denied") {
          // Permission denied, provide fallback
          console.log("Push notification permission denied. You won't receive notifications.");
          // Provide a fallback here, like displaying a message to the user or showing an alternative way to get updates.
        } else if (permission === "default") {
          // User closed the permission dialog without making a choice
          console.log("Push notification permission prompt closed without making a choice.");
          // Provide a fallback here, like displaying a message to the user or showing an alternative way to get updates.
        }
      });
    } else {
      // Browser doesn't support notifications
      console.log("Push notifications not supported in this browser.");
      // Provide a fallback here, like displaying a message to the user or showing an alternative way to get updates.
    }
  }, []);
useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        const fajrRemaining = calculateRemainingTime(timings.Fajr);
        const maghribRemaining = calculateRemainingTime(timings.Maghrib);
        if (fajrRemaining.includes("hour") && fajrRemaining.split(',')[0] < 1) {
          new Notification("Fajr Prayer Reminder", {
            body: "Fajr prayer time is approaching in less than 1 hour."
          });
        }
        if (fajrRemaining.includes("minute") && fajrRemaining.split(',')[0] < 10) {
          new Notification("Fajr Prayer Reminder", {
            body: "Fajr prayer time is approaching in less than 10 minutes."
          });
        }
        if (maghribRemaining.includes("hour") && maghribRemaining.split(',')[0] < 1) {
          new Notification("Maghrib Prayer Reminder", {
            body: "Maghrib prayer time is approaching in less than 1 hour."
          });
        }
        if (maghribRemaining.includes("minute") && maghribRemaining.split(',')[0] < 10) {
          new Notification("Maghrib Prayer Reminder", {
            body: "Maghrib prayer time is approaching in less than 10 minutes."
          });
        }
      }
    });
  }
}, [timings, calculateRemainingTime]);
  return (
    <div>
      <div className="container mx-auto py-4 space-y-2">
        <div className="flex items-center gap-4 justify-between">
          <h1 className="text-3xl font-rocknroll">Islamics</h1>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-3 text-sm py-2 rounded-md bg-zinc-800/50 border border-zinc-700 active:bg-opacity-50 hover:bg-zinc-800 transition"
          >
            Refresh
          </button>
        </div>
        <p>
          Last update: {createdAt.toLocaleDateString()}{" "}
          {createdAt.toLocaleTimeString()}
        </p>
      </div>

      <div className="container mx-auto">
        <div className="h-83vh text-center flex flex-col gap-4">
          <div className="bg-zinc-800 bg-opacity-50 rounded-md border-2 border-zinc-700 p-2 flex flex-col justify-center gap-6 flex-grow">
            <h1 className="text-7xl">Fajr</h1>
            <h1 className="tracking-wide text-lg">
              {calculateRemainingTime(timings.Fajr)}
            </h1>
          </div>
          <div className="bg-zinc-800 bg-opacity-50 rounded-md border-2 border-zinc-700 p-2 flex flex-col justify-center gap-6 flex-grow">
            <h1 className="text-7xl">Maghrib</h1>
            <h1 className="tracking-wide text-lg">
              {calculateRemainingTime(timings.Maghrib)}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;