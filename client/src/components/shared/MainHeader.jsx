import React, { useEffect, useState } from 'react';
import car1 from '/Users/soura/OneDrive/Desktop/ENTRI-Assignment/CarRentalCap/client/public/car1.jpg';
import car2 from '/Users/soura/OneDrive/Desktop/ENTRI-Assignment/CarRentalCap/client/public/car2.jpg';
import car3 from '/Users/soura/OneDrive/Desktop/ENTRI-Assignment/CarRentalCap/client/public/car3.jpg';
import car4 from '/Users/soura/OneDrive/Desktop/ENTRI-Assignment/CarRentalCap/client/public/car4.jpg';

const images = [car1, car2, car3, car4];

export const MainHeader = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Carousel */}
      <div className="relative max-w-5xl mx-auto overflow-hidden">
        <div className="relative h-[22rem]">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                index === currentSlide
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-90 z-0'
              }`}
            >
              <img
                src={img}
                alt={`Car ${index + 1}`}
                className="rounded-xl shadow-xl w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
          <button
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
          >
            ❮
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % images.length)
            }
            className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};