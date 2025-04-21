import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { CarCardSkeltons } from "../../components/user/Skeletons";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const Bookings = ({ userId }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const paymentSuccess = location.state?.paymentSuccess;

  const [selectedCategory, setSelectedCategory] = useState("active");

  const [data, isLoading, error] = useFetch(`/booking/getBookings/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const bookings = Array.isArray(data) ? data : [];

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() !== "completed" &&
      booking.status?.toLowerCase() !== "cancelled"
  );
  const completedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed"
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "cancelled"
  );

  const makePayment = async (booking) => {
    try {
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_Publishable_key
      );
      const session = await axiosInstance.post(
        "/payment/create-checkout-session",
        {
          products: [
            {
              carId: {
                name: booking.carId?.name,
                image: booking.carId?.image,
                price: booking.totalPrice,
              },
            },
          ],
          bookingId: booking._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await stripe.redirectToCheckout({ sessionId: session.data.sessionId });
    } catch (error) {
      console.error(error);
    }
  };

  const requestCancellation = async (bookingId) => {
    try {
      const confirmed = window.confirm(
        "Do you want to request cancellation for this booking?"
      );
      if (!confirmed) return;

      toast.loading("Requesting cancellation...");
      await axiosInstance.post(
        "/booking/request-cancel",
        { bookingId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.dismiss();
      toast.success("Cancellation requested!");
      window.location.reload();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to request cancellation."
      );
      console.error(error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const getDisplayedBookings = () => {
    if (selectedCategory === "active") return activeBookings;
    if (selectedCategory === "completed") return completedBookings;
    if (selectedCategory === "cancelled") return cancelledBookings;
    return [];
  };

  const selectedLabel = {
    active: "Active Bookings",
    completed: "✅ Completed Bookings",
    cancelled: "❌ Cancelled Bookings",
  };

  if (isLoading) return <CarCardSkeltons />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Bookings</h2>

      {paymentSuccess && (
        <div className="text-green-600 text-center mb-4 font-semibold">
          ✅ Payment was successful!
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <>
          {/* Dropdown to select booking category */}
          <div className="flex justify-center mb-6">
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="active">Active Bookings</option>
              <option value="completed">Completed Bookings</option>
              <option value="cancelled">Cancelled Bookings</option>
            </select>
          </div>

          {/* Display bookings based on selection */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-3 text-center">
              {selectedLabel[selectedCategory]}
            </h3>
            <div className="flex flex-col items-center gap-4">
              {getDisplayedBookings().length === 0 ? (
                <p className="text-center text-gray-500">
                  No {selectedCategory} bookings.
                </p>
              ) : (
                getDisplayedBookings().map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    makePayment={makePayment}
                    requestCancellation={requestCancellation}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const BookingCard = ({ booking, makePayment, requestCancellation }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const status = booking.status?.toLowerCase();
  const isPaid = booking.paymentStatus === "success";

  const handleReviewSubmit = async () => {
    try {
      await axiosInstance.post(
        "/review/add-review",
        {
          carId: booking.carId._id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="rounded-lg p-6 w-full max-w-xl items-center glass shadow-md">
      <h3 className="text-xl font-bold mb-2 text-center">
        {booking.carId?.name || "Car Name"}
      </h3>

      {booking.carId?.image && (
        <img
          className="h-40 w-full object-contain mb-3"
          src={booking.carId.image}
          alt="car"
        />
      )}

      <div className="text-center mt-3">
        <p>
          <span className="font-semibold">Pick-up:</span>{" "}
          {booking.pickUpLocation} on{" "}
          {new Date(booking.pickUpDate).toLocaleDateString()} at{" "}
          {booking.pickUpTime}
        </p>
        <p>
          <span className="font-semibold">Drop-off:</span>{" "}
          {booking.dropOffLocation}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`font-bold ${
              status === "confirmed"
                ? "text-green-600"
                : status === "cancelled"
                ? "text-red-500"
                : status === "completed"
                ? "text-white"
                : status === "cancellation_requested"
                ? "text-yellow-600"
                : "text-gray-500"
            }`}
          >
            {booking.status}
          </span>
        </p>
        <p>
          <span className="font-semibold">Payment:</span>{" "}
          {booking.paymentStatus}
        </p>
        <p>
          <span className="font-semibold">Total Price:</span> ₹
          {booking.totalPrice}
        </p>

        {isPaid && status !== "completed" && status !== "cancelled" && (
          <div className="mt-3">
            {status === "cancellation_requested" ? (
              <p className="font-semibold text-yellow-600">
                Booking Cancellation Requested
              </p>
            ) : (
              <button
                className="btn btn-warning"
                onClick={() => requestCancellation(booking._id)}
              >
                Request Cancellation
              </button>
            )}
          </div>
        )}

        {!isPaid && (
          <div className="mt-3">
            <p className="mb-1 text-emerald-500">To Confirm Booking</p>
            <button
              className="btn btn-success"
              onClick={() => makePayment(booking)}
            >
              Pay Now
            </button>
          </div>
        )}

        {status === "completed" && (
          <div className="mt-4">
            {!showReviewForm ? (
              <button
                className="btn btn-info"
                onClick={() => setShowReviewForm(true)}
              >
                ✍️ Leave a Review
              </button>
            ) : (
              <div className="mt-3 space-y-2 text-left">
                <div>
                  <label className="block font-semibold">Rating (1–5):</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block font-semibold">Comment:</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    className="btn btn-success"
                    onClick={handleReviewSubmit}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
