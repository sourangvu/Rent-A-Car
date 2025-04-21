import React, { useEffect, useState } from 'react';



export const MainHeader = () => {

  return (
    <div className="relative py-20 px-4">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold ">
          Find Your Perfect Ride
        </h1>
        <p className="mt-4 text-gray-300 text-lg max-w-xl mx-auto">
          Fast, affordable, and flexible car rentals — anytime, anywhere.
        </p>
      </div>

    </div>
  );
};