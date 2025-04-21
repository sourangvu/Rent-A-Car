import React from "react";
import { NavLink } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";

export const Header = () => {
  return (
    <div className="flex justify-between items-center p-14 h-20 shadow-2xl relative">
      {/* Logo Section */}
      <div className="absolute left-0">
        <img
          src="https://st4.depositphotos.com/1801497/26419/v/450/depositphotos_264195246-stock-illustration-vector-logo-rent-car-white.jpg"
          alt="Logo"
          className="h-25 rounded-4xlh-28 rounded-4xl border-4 border-orange-300 shadow-lg transform hover:scale-105 transition-transform duration-300h-28 rounded-full transform hover:rotate-360 hover:scale-110 transition-all duration-500"
        />
      </div>

      {/* Navigation Menu Section */}
      <div className="flex justify-center w-full">
        <nav  className="flex justify-center items-center gap-20 text-md font-semibold">
          
            <DarkMode />

            {/* Navigation Links */}
       
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-400 hover:scale-120 transition-transform"
                    : "hover:scale-120 transition-transform"
                }
              >
                Home
              </NavLink>
           
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-400 hover:scale-120 transition-transform"
                    : "hover:scale-120 transition-transform"
                }
              >
                About
              </NavLink>
           
              <NavLink
                to="/cars"
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-400 hover:scale-120 transition-transform"
                    : "hover:scale-120 transition-transform"
                }
              >
                Services
              </NavLink>
           
              <NavLink
                to="/cars"
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-400 hover:scale-120 transition-transform"
                    : "hover:scale-120 transition-transform"
                }
              >
                Cars
              </NavLink>
           
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-400 hover:scale-120 transition-transform"
                    : "hover:scale-120 transition-transform"
                }
              >
                Login
              </NavLink>
           
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-400 hover:scale-120 transition-transform"
                    : "hover:scale-120 transition-transform"
                }
              >
                Contact Us
              </NavLink>
           
        
        </nav>
      </div>
    </div>
  );
};
