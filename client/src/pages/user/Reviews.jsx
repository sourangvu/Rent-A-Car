import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserReviews = async () => {
    try {
      const response = await axiosInstance.get("/review/my-reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch your reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axiosInstance.delete(`/review/delete-review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Review deleted successfully");
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete review");
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading your reviews...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold mb-6">📝 Your Car Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't submitted any reviews yet.</p>
      ) : (
        <div className="space-y-4 w-full flex flex-col items-center glass rounded-2xl">
          {reviews.map((review) => (
            <div key={review._id} className=" p-4 rounded w-full max-w-xl">
              <div className="flex items-center gap-4 mb-2 justify-center">
                <img
                  src={review.carId?.image}
                  alt={review.carId?.name}
                  className="h-16 w-24 object-cover rounded"
                />
                <div className="text-left">
                  <h2 className="font-semibold text-lg">
                    {review.carId?.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mb-1 text-left">
                <strong>Rating:</strong> ⭐ {review.rating} / 5
              </p>
              <p className="text-left">
                <strong>Comment:</strong> {review.comment}
              </p>
              <div className="mt-2 text-right">
                <button
                  className="btn btn-error"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
