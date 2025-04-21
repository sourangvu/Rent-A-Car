import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";


export const CarCard = ({ car }) => {
  const navigate = useNavigate();

  return (
    <>
     <div className="card glass w-96 shadow-xl border border-white/20 backdrop-blur-sm bg-white/10 hover:shadow-2xl transition-all duration-500">
  {/* Image */}
  <figure className="px-10 pt-10">
    <img
      src={car?.image}
      alt={car?.name}
      className="rounded-xl transition-all duration-500 ease-in-out transform hover:scale-105 hover:brightness-95 shadow-md"
    />
  </figure>

  {/* Body */}
  <div className="card-body items-center text-center space-y-4">
    <h2 className="card-title text-2xl font-bold text-white drop-shadow-md">
      {car?.name}
    </h2>
    <p className="text-gray-200 text-sm">{car?.description}</p>

    {/* Price */}
    <p className="text-lg font-semibold text-lime-300 bg-lime-800/30 px-4 py-1 rounded-full shadow-sm">
      ${car?.price} / day
    </p>

    {/* Button */}
    <div className="card-actions justify-center">
      <button
        className="btn btn-success px-6 py-2 rounded-lg  font-semibold transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() => navigate(`/carDetails/${car?._id}`)}
        >
        View Details
      </button>
    </div>
  </div>
</div>
        </>
  );
};


export const CarCardAdmin = ({ car }) => {
  const navigate = useNavigate();
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // react-hook-form for managing update car form
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Pre-fill the form with current car data
  const fillForm = () => {
    setValue('name', car?.name);
    setValue('brand', car?.brand);
    setValue('year', car?.year);
    setValue('model', car?.model);
    setValue('description', car?.description);
    setValue('price', car?.price);
  };

  const handleUpdateCar = async (data) => {
    try {
      const response = await axiosInstance.put(`/car/updateCar/${car?._id}`, data);
      toast.success('Car updated successfully!');
      setShowUpdateForm(false); 
      window.location.reload(); 
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Failed to update car');
    }
  };

  const handleDeleteCar = async () => {
    try {
      await axiosInstance.delete(`/car/deleteCar/${car?._id}`);
      toast.success('Car deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data?.message || 'Failed to delete car');
    }
  };

  return (
    <div>
      <div className="flex gap-20">
        <div className="w-full">
          {car?.length === 0 ? (
            <div className="flex justify-center items-center h-screen">
              <button className="btn btn-info" onClick={() => navigate('/cars')}>
                No Cars Available! Create New Car!
              </button>
            </div>
          ) : (
            <div className="flex w-6xl rounded-3xl items-center justify-between glass my-5 pr-5">
              <img className="h-40 rounded-3xl" src={car?.image} alt="carimg" />
              <div className="text-center">
                <h3>{car?.name}</h3>
                <h3>{car?.brand}</h3>
                <h3>{car?.year}</h3>
                <h3>{car?.model}</h3>
                <h3>{car?.description}</h3>
                <h3>{car?.price}/Day</h3>
              </div>
              <div className="flex gap-20">
                <button
                  className="btn btn-error transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:opacity-90"
                  onClick={() => {
                    setShowUpdateForm(true);
                    fillForm();
                  }}
                >
                  Update Car
                </button>
                <button
                  className="btn btn-success transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:opacity-90"
                  onClick={handleDeleteCar}
                >
                  Delete Car
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <div className="w-full flex items-center justify-center">
          <div className="p-5 glass rounded-2xl mt-5 w-full sm:w-96">
            <h2 className="text-center font-bold text-2xl mb-4">Update Car</h2>
            <form onSubmit={handleSubmit(handleUpdateCar)}>
              {/* Car Name Input */}
              <div className="mb-4">
                <label htmlFor="name" className="block font-semibold">Car Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Car name is required", minLength: 2, maxLength: 50 })}
                  id="name"
                  className="input input-bordered w-full"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Car Brand Input */}
              <div className="mb-4">
                <label htmlFor="brand" className="block font-semibold">Brand</label>
                <input
                  type="text"
                  {...register("brand", { required: "Car brand is required", minLength: 2, maxLength: 50 })}
                  id="brand"
                  className="input input-bordered w-full"
                />
                {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
              </div>

              {/* Car Year Input */}
              <div className="mb-4">
                <label htmlFor="year" className="block font-semibold">Year</label>
                <input
                  type="number"
                  {...register("year", { required: "Year is required", min: 1900, max: new Date().getFullYear() })}
                  id="year"
                  className="input input-bordered w-full"
                />
                {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
              </div>

              {/* Car Model Input */}
              <div className="mb-4">
                <label htmlFor="model" className="block font-semibold">Model</label>
                <input
                  type="text"
                  {...register("model", { required: "Car model is required", minLength: 2, maxLength: 50 })}
                  id="model"
                  className="input input-bordered w-full"
                />
                {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
              </div>

              {/* Car Description Input */}
              <div className="mb-4">
                <label htmlFor="description" className="block font-semibold">Description</label>
                <textarea
                  {...register("description", { required: "Description is required", minLength: 2, maxLength: 150 })}
                  id="description"
                  className="input input-bordered w-full"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              {/* Car Price Input */}
              <div className="mb-4">
                <label htmlFor="price" className="block font-semibold">Price</label>
                <input
                  type="number"
                  {...register("price", { required: "Price is required" })}
                  id="price"
                  className="input input-bordered w-full"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button type="submit" className="btn btn-primary border-none hover:bg-blue-500 transition-colors duration-300">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export const UserCardAdmin = ({ user }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = async () => {
    setIsDeleting(true);
    try {
      //Correct user ID field
      await axiosInstance.delete(`/user/delete-account/${user?._id}`);

      toast.success('User deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-20">
      <div className="w-full">
        {user ? (
          <div className="flex w-6xl rounded-3xl items-center justify-between glass my-5 p opacity-100 pr-5">
            <img className="h-40 rounded-3xl" src={user?.profilePic} alt="userimg" />
            <div className="text-center text-xl">
              <h1>{user?.name}</h1>
              <h1>{user?.email}</h1>
              <h1>{user?.mobile}</h1>
            </div>
            <div className="flex gap-20">
              <button
                className="btn btn-base transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:opacity-90"
                onClick={deleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <Link to="/users">
              <button className="btn btn-info">No Users Available</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};