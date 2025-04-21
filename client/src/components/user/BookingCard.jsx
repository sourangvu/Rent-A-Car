import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { axiosInstance } from '../../config/axiosInstance';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const BookingCard = ({ carDetails }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [selectedCar] = useState(carDetails);
  const [totalPrice, setTotalPrice] = useState(0);
  const [rentalDays, setRentalDays] = useState(1); 
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pickUpDate = useWatch({ control, name: 'pickUpDate' });
  const dropOffDate = useWatch({ control, name: 'dropOffDate' });

  useEffect(() => {
    if (pickUpDate && dropOffDate) {
      const start = new Date(pickUpDate);
      const end = new Date(dropOffDate);

      if (end >= start) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const days = Math.ceil((end - start) / msPerDay) || 1;
        const total = selectedCar.price * days;

        setRentalDays(days);
        setTotalPrice(total);
      } else {
        setTotalPrice(0);
        setRentalDays(0);
      }
    }
  }, [pickUpDate, dropOffDate, selectedCar.price]);

  const onSubmit = async (data) => {
    const bookingData = {
      ...data,
      carId: selectedCar?._id,
      totalPrice,
    };

    try {
      const response = await axiosInstance.post('/booking/newBooking', bookingData);
      toast.success('Booking successful!');
      navigate('/user/booking');
    } catch (error) {
      setErrorMessage('Complete Your Active Booking');
      toast.error('Booking failed');
      console.error(error);
    }
  };

  return (
    <div className="bg-base-200 hero min-h-screen">
      <div className="flex-col hero-content">
        <div className="text-center lg:text-left p-5">
          <h1 className="text-5xl font-bold">Car Booking</h1>
        </div>
        <div className="card glass bg-base-100 shadow-2xl w-full max-w-sm shrink-0">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            {/* Pick Up Location */}
            <div className="form-control">
              <label className="label"><span className="label-text">Pick Up Location</span></label>
              <input
                type="text"
                placeholder="Pick Up Location"
                {...register('pickUpLocation', { required: 'Pick up location is required' })}
                className="input input-bordered"
              />
              {errors.pickUpLocation && <p className="text-red-500">{errors.pickUpLocation.message}</p>}
            </div>

            {/* Drop Off Location */}
            <div className="form-control">
              <label className="label"><span className="label-text">Drop Off Location</span></label>
              <input
                type="text"
                placeholder="Drop Off Location"
                {...register('dropOffLocation', { required: 'Drop off location is required' })}
                className="input input-bordered"
              />
              {errors.dropOffLocation && <p className="text-red-500">{errors.dropOffLocation.message}</p>}
            </div>

            {/* Pick Up Date */}
            <div className="form-control">
              <label className="label"><span className="label-text">Pick Up Date</span></label>
              <input
                type="date"
                {...register('pickUpDate', { required: 'Pick up date is required' })}
                className="input input-bordered"
              />
              {errors.pickUpDate && <p className="text-red-500">{errors.pickUpDate.message}</p>}
            </div>

            {/* Drop Off Date */}
            <div className="form-control">
              <label className="label"><span className="label-text">Drop Off Date</span></label>
              <input
                type="date"
                {...register('dropOffDate', { required: 'Drop off date is required' })}
                className="input input-bordered"
              />
              {errors.dropOffDate && <p className="text-red-500">{errors.dropOffDate.message}</p>}
            </div>

            {/* Pick Up Time */}
            <div className="form-control">
              <label className="label"><span className="label-text">Pick Up Time</span></label>
              <input
                type="time"
                {...register('pickUpTime', { required: 'Pick up time is required' })}
                className="input input-bordered"
              />
              {errors.pickUpTime && <p className="text-red-500">{errors.pickUpTime.message}</p>}
            </div>

            {/* Car Info */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Car Selected: {selectedCar?.name} - ${selectedCar?.price}/day
                </span>
              </label>
            </div>

            {/* Duration + Total Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">
                  Rental Duration: {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </span>
              </label>
              <label className="label">
                <span className="label-text font-bold">
                  Total Price: ${totalPrice}
                </span>
              </label>
            </div>

            <div className="flex form-control mt-6 justify-center">
              <button className="btn btn-primary">Book Now</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};