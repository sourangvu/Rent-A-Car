import React from "react";
import { CarTaxiFront, CircleUser, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Import useNavigate hook
import { DarkMode } from "../shared/DarkMode";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

export const UserHeader = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleLogout = async () => {
    try {
      // Optionally call the backend API to invalidate the user session
      await axiosInstance({
        method: "POST",
        url: "user/logout",
      });

      // Clear local storage or any other authentication-related state
      localStorage.removeItem("authToken");
      toast.success("Logged out successfully");

      // Redirect the user to the login page
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center w-full px-20 h-24 shadow-2xl relative">
      <div className="absolute left-0">
        <img
          src="https://st4.depositphotos.com/1801497/26419/v/450/depositphotos_264195246-stock-illustration-vector-logo-rent-car-white.jpg"
          alt="Logo"
          className="h-16 md:h-24"
        />
      </div>
      <nav className="flex justify-center items-center gap-10 font-semibold w-full">
        <DarkMode />

        {/* Text Links with Hover Effects */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-orange-400 hover:scale-120 transition-transform" : "hover:scale-120 transition-transform"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/cars"
          className={({ isActive }) =>
            isActive ? "text-orange-400 hover:scale-120 transition-transform" : "hover:scale-120 transition-transform"
          }
        >
          Cars
        </NavLink>
        <NavLink
          to="/user/bookings"
          className={({ isActive }) =>
            isActive ? "text-orange-400 hover:scale-120 transition-transform" : "hover:scale-120 transition-transform"
          }
        >
          Your Bookings
        </NavLink>
        <NavLink
          to="/user/cart"
          className={({ isActive }) =>
            isActive ? "text-orange-400 hover:scale-120 transition-transform" : "hover:scale-120 transition-transform"
          }
        >
          Your Ride Awaits
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-orange-400 hover:scale-120 transition-transform" : "hover:scale-120 transition-transform"
          }
        >
          About
        </NavLink>

        {/* Icon Links with Hover Effects */}
        <NavLink
          to="/user/cart"
          aria-label="View Cart"
          className="hover:scale-120 transition-transform"
        >
          <CarTaxiFront />
        </NavLink>
        <NavLink
          to="/user/profile"
          aria-label="View Profile"
          className="hover:scale-120 transition-transform"
        >
          <CircleUser />
        </NavLink>
        <NavLink
          to="/user/logout"
          aria-label="Logout"
          className="hover:scale-120 transition-transform"
        >
          <LogOut onClick={handleLogout} />
        </NavLink>
      </nav>
    </div>
  );
};