"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ScheduleStep({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}) {
  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          required
        />
      </div>
      <p className="col-span-2 text-xs text-muted">
        Detailing appointments run 8:00 AM – 7:00 PM. We&apos;ll confirm the exact
        arrival window once your deposit clears.
      </p>
    </div>
  );
}
