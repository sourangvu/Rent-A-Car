import React from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import { CircleUser, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export const AdminHeader = () => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await axiosInstance({
        method: "POST",
        url: "admin/logout",
      });

      localStorage.removeItem("authToken");
      toast.success("Logged out successfully");

      Navigate("/admin/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full px-4 sm:px-8 md:px-16 lg:px-20 h-auto sm:h-24 shadow-2xl relative gap-4 sm:gap-0 py-4 sm:py-0">
      <div className="flex justify-center sm:justify-start">
        <img
          src="https://st4.depositphotos.com/1801497/26419/v/450/depositphotos_264195246-stock-illustration-vector-logo-rent-car-white.jpg"
          alt="Logo"
          className="h-20 sm:h-23 rounded-2xl orange-300 shadow-lg transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      <nav className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 font-semibold w-full">
        <DarkMode />

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/admin/cars"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          All Cars
        </NavLink>

        <NavLink
          to="/admin/booking"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          All Bookings
        </NavLink>

        <NavLink
          to="/admin/user"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          All Users
        </NavLink>

        <NavLink
          to="/admin/profile"
          aria-label="View Profile"
          className="hover:scale-110 transition-transform"
        >
          <CircleUser />
        </NavLink>

        <NavLink
          to="/admin/logout"
          aria-label="Logout"
          className="hover:scale-110 transition-transform"
        >
          <LogOut onClick={handleLogout} />
        </NavLink>
      </nav>
    </div>
  );
};