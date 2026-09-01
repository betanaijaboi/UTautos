import { CalendarClock } from "lucide-react";
import { getMyAssignedBookings } from "@/lib/actions/detailer";
import { JobCard } from "@/components/detailer/job-card";

export const metadata = {
  title: "Detailer Dashboard — UT Autos",
  robots: { index: false, follow: false },
};

export default async function DetailerDashboardPage() {
  const bookings = await getMyAssignedBookings();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Your Route
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground">
        Assigned Jobs
      </h1>

      {bookings.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <CalendarClock className="h-8 w-8 text-muted" />
          <p className="text-sm text-muted">No jobs assigned to you right now.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <JobCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
