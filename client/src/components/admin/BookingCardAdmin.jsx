import React, { useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';

export const BookingCardAdmin = ({ booking }) => {
  const [selectedStatus, setSelectedStatus] = useState(booking.status);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(booking.paymentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
  
    try {
      setLoading(true);
      console.log("Sending update for booking ID:", booking._id);
      console.log("New status:", newStatus);
  
      const response = await axiosInstance.put('/admin/update-booking-status', {
        bookingId: booking._id,
        status: newStatus,
      });
  
      toast.success(response.data.message || 'Status updated');
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      const message = error.response?.data?.message || error.response?.data?.error || error.message;
      toast(`Failed to update status: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusChange = async (e) => {
    const newPaymentStatus = e.target.value;
    setSelectedPaymentStatus(newPaymentStatus);
  
    try {
      setLoading(true);
      console.log("Sending update for booking ID:", booking._id);
      console.log("New payment status:", newPaymentStatus);
  
      const response = await axiosInstance.put('/admin/update-payment-status', {
        bookingId: booking._id,
        paymentStatus: newPaymentStatus,
      });
  
      toast.success(response.data.message || 'Payment status updated');
    } catch (error) {
      console.error('Error updating payment status:', error);
      const message = error.response?.data?.message || error.response?.data?.error || error.message;
      toast(`Failed to update payment status: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancellation_requested', label: 'Cancellation Requested' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  return (
    <div className="glass rounded-2xl p-4 w-80">
      <h3 className="font-bold text-lg mb-2">Booking ID: {booking._id}</h3>

      <p><span className="font-semibold">User:</span> {booking.user?.name || 'Unknown'} ({booking.user?.email || 'No Email'})</p>
      {booking.user?.profilePic && (
        <img className="h-20 rounded-xl mb-3" src={booking.user.profilePic} alt="user" />
      )}

      {booking.carId?.image && (
        <img className="h-20 rounded-xl mb-3" src={booking.carId.image} alt="car" />
      )}
      <p><span className="font-semibold">Car :</span> {booking.carId?.name || booking.carId?.model || 'N/A'}</p>
      <p><span className="font-semibold">Brand :</span> {booking.carId?.brand || 'N/A'}</p>
      <p><span className="font-semibold">Year :</span> {booking.carId?.year || 'N/A'}</p>

      <div className="mt-2 text-sm">
        <p><strong>Pickup :</strong> {booking.pickUpLocation} @ {booking.pickUpTime} on {new Date(booking.pickUpDate).toLocaleDateString()}</p>
        <p><strong>Dropoff :</strong> {booking.dropOffLocation}</p>
        <p><strong>Dropoff Date :</strong> {new Date(booking.dropOffDate).toLocaleDateString()}</p>

        <p className='text-black'><strong>Status :</strong>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            disabled={loading}
            className="ml-2 rounded-box bg-amber-300 mb-1"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </p>

        <p className='text-black'><strong>Payment Status :</strong>
          <select
            value={selectedPaymentStatus}
            onChange={handlePaymentStatusChange}
            disabled={loading}
            className="ml-2 rounded-box bg-amber-400"
          >
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </p>

        <p><strong>Total :</strong> ₹{booking.totalPrice}</p>
      </div>
    </div>
  );
};