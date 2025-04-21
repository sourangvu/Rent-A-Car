import React from 'react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>

      <p className="mb-4">
        Welcome to <span className="font-semibold text-blue-400">Rent A Car</span>, your trusted partner for car rentals.
      </p>

      <p className="mb-6">
        We make it easy, affordable, and stress-free to rent the perfect car for any occasion — whether you're planning a weekend getaway, a business trip, or just need a ride around town.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us?</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>🚗 Wide selection of vehicles</li>
        <li>💰 Affordable and transparent pricing</li>
        <li>📆 Flexible rental plans</li>
        <li>🌐 Easy online booking</li>
        <li>📞 24/7 customer support</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
      <p className="mb-4">
        To provide reliable, convenient, and affordable car rental services that exceed customer expectations — every time.
      </p>

      <p>
        Thank you for choosing <span className="font-semibold text-blue-400">Rent A Car</span>. We look forward to getting you on the road!
      </p>
    </div>
  );
};