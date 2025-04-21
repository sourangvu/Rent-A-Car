import React, { useState } from "react";
import { BookingCardAdmin } from "../../components/admin/BookingCardAdmin";
import { CarCardSkeltons } from "../../components/user/Skeletons";
import { useFetch } from "../../hooks/useFetch";

export const AllBookings = () => {
  const token = localStorage.getItem("token");
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const [response, isLoading, error] = useFetch("/booking/allBookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const bookings = Array.isArray(response) ? response : [];

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filteredBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === selectedStatus
  );

  const statusLabels = {
    pending: "Pending Bookings",
    confirmed: "Confirmed Bookings",
    completed: "Completed Bookings",
    cancellation_requested: "Cancellation Requested",
    cancelled: "Cancelled Bookings",
  };

  if (isLoading) return <CarCardSkeltons />;
  if (error)
    return <p className="text-red-500 text-center mt-4">Error: {error}</p>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pt-10">
      <h1 className="text-center text-white font-bold text-4xl mb-6">
        All Bookings
      </h1>

      <div className="flex justify-center mb-8">
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancellation_requested">Cancellation Requested</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <h2 className="text-center text-white font-semibold text-2xl mb-6">
        {statusLabels[selectedStatus]}
      </h2>

      <div className="flex flex-wrap gap-5 justify-start ml-10 p-5">
        {filteredBookings.length === 0 ? (
          <p className="text-white text-xl">
            No {selectedStatus} bookings found.
          </p>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCardAdmin booking={booking} key={booking._id} />
          ))
        )}
      </div>
    </div>
  );
};
