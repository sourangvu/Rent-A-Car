import { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const AdminCancelRequests = () => {
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCancellationRequests = async () => {
    try {
      const res = await axiosInstance.get("/booking/allBookings");
      const allBookings = res.data || [];

      const pendingCancellations = allBookings.filter(
        (booking) => booking.status === "cancellation_requested"
      );

      setCancellationRequests(pendingCancellations);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load bookings.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancellationRequests();
  }, []);

  const approveCancellation = async (bookingId) => {
    try {
      await axiosInstance.post("/approve-cancel-booking", {
        bookingId,
      });
      toast.success("Cancellation approved and refunded.");
      fetchCancellationRequests();
    } catch (err) {
      const message =
        err.response?.data?.message || "Error approving cancellation";
      toast.error(message);
    }
  };

  if (loading)
    return <p className="text-center">Loading cancellation requests...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Pending Cancellation Requests
      </h2>

      {cancellationRequests.length === 0 ? (
        <p className="text-center">🎉 No pending cancellations</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cancellationRequests.map((booking) => (
            <div
              key={booking._id}
              className="glass p-6 rounded-xl shadow-md border border-orange-200"
            >
              <h3 className="text-xl font-semibold mb-2">
                Booking ID: {booking._id}
              </h3>
              <p>User ID: {booking.user}</p>
              <p>Car: {booking?.carId?.name || "Unknown"}</p>
              <p>Pick Up: {booking.pickUpLocation}</p>
              <p>Drop Off: {booking.dropOffLocation}</p>
              <p>
                Status:{" "}
                <span className="text-yellow-500 font-semibold">
                  {booking.status}
                </span>
              </p>
              <p>Payment Status: {booking.paymentStatus}</p>

              <button
                className="btn btn-success mt-4"
                onClick={() => approveCancellation(booking._id)}
              >
                Approve Cancellation & Refund
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
