"use client";

import { useEffect, useState } from "react";

function now(timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.day}.${parts.month}`, time: `${parts.hour}:${parts.minute}` };
}

/** "Now is 21.11, 16:08 in Bandung" — local time where you are, not the visitor's. */
export function Clock({ city, timeZone }: { city: string; timeZone: string }) {
  const [value, setValue] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    const tick = () => setValue(now(timeZone));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <div className="anri-clock">
      Now is <span>{value?.date ?? "--.--"}</span>,<br />
      <span>{value?.time ?? "--:--"}</span> in {city}
    </div>
  );
}
