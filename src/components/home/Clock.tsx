"use client";

import { useEffect, useState } from "react";

function now(timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.day}.${parts.month}`, time: `${parts.hour}:${parts.minute} ${String(parts.dayPeriod).toUpperCase()}` };
}

/** "Now is 21.11, 06:50 PM in Bandung" — local time. */
export function Clock({ city, country, timeZone }: { city: string; country: string; timeZone: string }) {
  const [value, setValue] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    const tick = () => setValue(now(timeZone));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <div className="home-clock">
      <span>{value?.time ?? "--:-- --"}</span> in <span>{city}</span>, <span>{country}</span>
    </div>
  );
}
