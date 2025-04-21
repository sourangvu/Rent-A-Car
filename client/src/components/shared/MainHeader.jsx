import React, { useEffect, useState } from 'react';

// Live image URLs with custom text for each slide
const images = [
  {
    url: 'https://wallpapercave.com/wp/wp9829813.jpg',
    title: 'Luxury Drive',
    description: 'Cruise in luxury with our premium collection.',
  },
  {
    url: 'https://www.hdwallpapers.in/download/audi_r8_v10_rwd_coupe_4k_5k_hd_cars-3840x2160.jpg',
    title: 'Speed & Style',
    description: 'Feel the power and performance of the Audi R8.',
  },
  {
    url: 'https://5.imimg.com/data5/HV/DW/GLADMIN-47897113/car-rental.jpg',
    title: 'Affordable Rentals',
    description: 'Reliable cars at budget-friendly prices.',
  },
];

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
        <h1 className="text-4xl md:text-5xl font-bold">
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
              <div className="relative w-full h-full">
                <img
                  src={img.url}
                  alt={`Slide ${index + 1}`}
                  className="rounded-xl shadow-xl w-full h-full object-cover object-center"
                />
                {/* Text Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-2xl md:text-4xl font-semibold mb-2">
                      {img.title}
                    </h2>
                    <p className="text-md md:text-lg">{img.description}</p>
                  </div>
                </div>
              </div>
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