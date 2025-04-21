import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { CarCardSkeltons } from "../../components/user/Skeletons";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";
import { useSelector } from "react-redux";
import { BookingCard } from "../../components/user/BookingCard";

export const CarDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isUserAuth } = useSelector((state) => state.user);

  const [carDetails, isLoading, error] = useFetch(
    `/car/getCarDetails/${params?.id}`
  );
  const [showBookingCard, setShowBookingCard] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleAddToCart = async () => {
    if (!isUserAuth) {
      toast.error("You need to be logged in to add a car to the ride.");
      navigate("/login");
      return;
    }

    try {
      await axiosInstance.post("/cart/add-to-cart", { carId: params?.id });
      toast.success("Car Added To Ride");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable To Add Car To Ride"
      );
    }
  };

  const handleBookNowClick = () => {
    setShowBookingCard(true);
  };

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(
        `/review/car-reviews/${params?.id}`
      );
      setReviews(response.data.data);
      setShowReviews(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch reviews");
    }
  };

  if (isLoading) return <CarCardSkeltons />;
  if (error) return <div>Error loading car details.</div>;

  return (
    <>
      <h1 className="text-center font-bold text-4xl">Car Details</h1>
      <div className="flex justify-center p-10">
        <div className="card glass w-full shadow-sm">
          <figure className="px-10 pt-10">
            <img
              src={carDetails?.image}
              alt="cars"
              className="rounded-xl transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h1 className="card-title text-4xl">{carDetails?.name}</h1>
            <h2 className="text-2xl">{carDetails?.description}</h2>
            <h2 className="text-2xl text-green-500">
              Pay - ₹{carDetails?.price}/Day
            </h2>

            <div className="card-actions flex  flex-row gap-3">
              <button className="btn btn-info w-full" onClick={handleAddToCart}>
                Add To Ride
              </button>
              <button
                className="btn btn-success w-full"
                onClick={handleBookNowClick}
              >
                Book Now
              </button>
              <button className="btn btn-warning w-full" onClick={fetchReviews}>
                Show Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBookingCard && <BookingCard carDetails={carDetails} />}

      {showReviews && (
        <div className="px-8 py-4">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {" "}
            Customer Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">
              No reviews available for this car.
            </p>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-300 p-4 rounded shadow-md border border-gray-200"
                >
                  <p className="text-lg font-semibold">
                    ⭐ {review.rating} / 5 —{" "}
                    <span className="text-gray-700">{review.userId?.name}</span>
                  </p>
                  <p className="text-gray-800">{review.comment}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
