import React from 'react'
import { useNavigate } from 'react-router-dom';

export const CarCard = ({car}) => {
    const navigate = useNavigate();

  return (
    <>
<div className="card glass bg-base-100 w-96 shadow-sm">
  <figure className="px-10 pt-10">
    <img
      src={car?.image}
      alt="cars"
      className="rounded-xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:brightness-90"
    />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title text-3xl">{car?.name}</h2>
    <p>{car?.description}</p>
    <p>{car?.price}</p>
    <div className="card-actions">
      <div className="card-actions justify-end gap-10">
        <button
          className="btn btn-error transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:opacity-90"
          onClick={() => navigate(`/carBooking/${car?._id}`)}>Book Now</button>
        <button
          className="btn btn-success transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:opacity-90"
          onClick={() => navigate(`/carDetails/${car?._id}`)}>Car Details</button>
      </div>
    </div>
  </div>
</div>

</>
  )
}
