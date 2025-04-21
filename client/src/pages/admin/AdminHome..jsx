import React, { useEffect, useState } from "react";
import { Users, Car, ClipboardList, DollarSign } from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(url);
      console.log("Full Response from API:", response);

      // Set the data correctly based on the response structure
      setData(response?.data || {});

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]); //

  return [data, isLoading, error];
};

// AdminHome Component using the useFetch hook
export const AdminHome = () => {
  const [data, isLoading, error] = useFetch("/admin/stats");

  // Log data for debugging when it's updated
  useEffect(() => {
    console.log("Full response data:", data);
  }, [data]);

  // Fallback to an empty object if data is undefined or null
  const statsData = data || {};
  console.log("Stats data:", statsData);

  // Define stats based on the fetched data
  const stats =
    Object.keys(statsData).length > 0
      ? [
          {
            title: "Total Users",
            value: statsData.totalUsers ?? 0,
            icon: <Users className="h-8 w-8 text-indigo-100" />,
          },
          {
            title: "Total Cars",
            value: statsData.totalCars ?? 0,
            icon: <Car className="h-8 w-8 text-indigo-100" />,
          },
          {
            title: "Total Bookings",
            value: statsData.totalBookings ?? 0,
            icon: <ClipboardList className="h-8 w-8 text-indigo-100" />,
          },
          {
            title: "Total Earnings",
            value: `$${(statsData.totalEarnings ?? 0).toLocaleString()}`,
            icon: <DollarSign className="h-8 w-8 text-indigo-100" />,
          },
        ]
      : [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl text-center font-bold mb-10">Welcome Admin</h1>

        {isLoading ? (
          <p className="text-center text-lg">Loading stats...</p>
        ) : error ? (
          <p className="text-center text-red-300">
            Error: {error.message || "Something went wrong"}
          </p>
        ) : stats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:scale-105 transform transition duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm uppercase font-semibold text-indigo-100">
                      {stat.title}
                    </h2>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div>{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">No stats available</p>
        )}
      </main>
    </div>
  );
};
