import { getAllBookings } from "@/lib/actions/admin-bookings";
import { BookingQueue } from "@/components/admin/booking-queue";

export const metadata = {
  title: "Admin Dashboard — UT Autos",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const bookings = await getAllBookings();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Operations
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground">
        Booking Queue
      </h1>
      <div className="mt-8">
        <BookingQueue bookings={bookings} />
      </div>
    </div>
  );
}
