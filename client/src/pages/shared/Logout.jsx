import React from "react";

export const Logout = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className=" glass p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-3xl font-semibold text-green-500 mb-4">
          You have successfully logged out!
        </h2>
        <p className="text-white mb-6">We hope to see you again soon.</p>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg transition duration-300 ease-in-out hover:bg-green-400 focus:outline-none"
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};
