import React, { useState } from "react";
import { CarTaxiFront, CircleUser, LogOut, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

export const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance({
        method: "POST",
        url: "user/logout",
      });

      localStorage.removeItem("authToken");
      toast.success("Logged out successfully");

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="shadow-2xl relative px-4 sm:px-10 md:px-20 py-4 bg-black">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://st4.depositphotos.com/1801497/26419/v/450/depositphotos_264195246-stock-illustration-vector-logo-rent-car-white.jpg"
            alt="Logo"
            className="h-16 sm:h-20 md:h-24 rounded-full border-4 border-orange-300 shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10 font-semibold text-white">
          <DarkMode />

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? " text-orange-400 hover:scale-110 transition-transform" : "hover:scale-110 transition-transform"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/cars"
            className={({ isActive }) =>
              isActive ? "text-orange-400 hover:scale-110 transition-transform" : "hover:scale-110 transition-transform"
            }
          >
            Cars
          </NavLink>
          <NavLink
            to="/user/booking"
            className={({ isActive }) =>
              isActive ? "text-orange-400 hover:scale-110 transition-transform" : "hover:scale-110 transition-transform"
            }
          >
            Your Bookings
          </NavLink>
          <NavLink
            to="/user/cart"
            className={({ isActive }) =>
              isActive ? "text-orange-400 hover:scale-110 transition-transform" : "hover:scale-110 transition-transform"
            }
          >
            Your Ride Awaits
          </NavLink>
          <NavLink
            to="/user/review"
            className={({ isActive }) =>
              isActive ? "text-orange-400 hover:scale-110 transition-transform" : "hover:scale-110 transition-transform"
            }
          >
            Your Reviews
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-orange-400 hover:scale-110 transition-transform" : "hover:scale-110 transition-transform"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/user/cart"
            aria-label="View Cart"
            className="hover:scale-110 transition-transform"
          >
            <CarTaxiFront />
          </NavLink>
          <NavLink
            to="/user/profile"
            aria-label="View Profile"
            className="hover:scale-110 transition-transform"
          >
            <CircleUser />
          </NavLink>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="hover:scale-110 transition-transform"
          >
            <LogOut />
          </button>
        </nav>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 font-semibold ">
          <DarkMode />

          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-orange-400" : ""
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/cars"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-orange-400" : ""
            }
          >
            Cars
          </NavLink>
          <NavLink
            to="/user/booking"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-orange-400" : ""
            }
          >
            Your Bookings
          </NavLink>
          <NavLink
            to="/user/cart"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-orange-400" : ""
            }
          >
            Your Ride Awaits
          </NavLink>
          <NavLink
            to="/user/review"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-orange-400" : ""
            }
          >
            Your Reviews
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-orange-400" : ""
            }
          >
            About
          </NavLink>
          <NavLink
            to="/user/cart"
            aria-label="View Cart"
            onClick={() => setIsMenuOpen(false)}
          >
            <CarTaxiFront />
          </NavLink>
          <NavLink
            to="/user/profile"
            aria-label="View Profile"
            onClick={() => setIsMenuOpen(false)}
          >
            <CircleUser />
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            aria-label="Logout"
          >
            <LogOut />
          </button>
        </div>
      )}
    </div>
  );
};