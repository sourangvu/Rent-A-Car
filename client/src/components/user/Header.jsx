import React from "react";
import { NavLink } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";

export const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full px-4 sm:px-8 py-4 shadow-2xl relative">
      {/* Logo Section */}
      <div className="flex justify-center sm:justify-start w-full mb-4 sm:mb-0">
        <img
          src="https://st4.depositphotos.com/1801497/26419/v/450/depositphotos_264195246-stock-illustration-vector-logo-rent-car-white.jpg"
          alt="Logo"
          className="h-20 sm:h-23 rounded-2xl border-4 border-orange-300 shadow-lg transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Navigation Menu Section */}
      <nav className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 font-semibold w-full">
        <DarkMode />

        {/* Navigation Links */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          About
        </NavLink>

        <NavLink
          to="/cars"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          Services
        </NavLink>

        <NavLink
          to="/cars"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          Cars
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          Login
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 hover:scale-110 transition-transform"
              : "hover:scale-110 transition-transform"
          }
        >
          Contact Us
        </NavLink>
      </nav>
    </div>
  );
};