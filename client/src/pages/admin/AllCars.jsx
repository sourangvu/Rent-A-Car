import React, { useState } from "react";
import { CarCardSkeltons } from "../../components/user/Skeletons";
import { CarCardAdmin } from "../../components/user/CarCard";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const AllCars = () => {
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [refetch, setRefetch] = useState(false); // State to trigger refetching data

  // Use the fetch hook, passing `refetch` as a dependency
  const [allCars, isLoading, error] = useFetch("/car/getAllCars", refetch);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const handleCreateCar = async (data) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append car data to FormData (other fields)
      formData.append("name", data.name);
      formData.append("brand", data.brand);
      formData.append("year", data.year);
      formData.append("model", data.model);
      formData.append("description", data.description);
      formData.append("price", data.price);

      // Append the image file to FormData (if it's available)
      if (data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const response = await axiosInstance.post("/car/createNewCar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("New Car Created Successfully");

      setRefetch(!refetch);
      setShowForm(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unable To Create Car");
    }
  };

  const handleFormSubmit = (data) => {
    console.log("New Car Data: ", data);
    handleCreateCar(data);
  };

  if (isLoading) {
    return <CarCardSkeltons />;
  }

  return (
    <>
      <div className=" w-fit h-full bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 pt-10">
        <h1 className="text-center font-bold text-4xl ">Available Cars</h1>
        <div className="flex justify-center pt-8">
          <button
            className="btn glass border-orange-300 hover:bg-orange-900 hover:text-white transition-colors duration-300"
            onClick={() => setShowForm(!showForm)}
          >
            Create New Car
          </button>
        </div>

        {showForm && (
          <div className="w-full flex items-center justify-center">
            <div className=" p-5 glass rounded-2xl mt-5 w-full sm:w-96">
              <h2 className="text-center font-bold text-2xl mb-4">
                Create New Car
              </h2>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* Car Name Input */}
                <div className="mb-4">
                  <label htmlFor="name" className="block font-semibold">
                    Car Name
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Car name is required",
                      minLength: 2,
                      maxLength: 50,
                    })}
                    id="name"
                    className="input input-bordered w-full"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="brand" className="block font-semibold">
                    Brand
                  </label>
                  <input
                    type="text"
                    {...register("brand", {
                      required: "Car brand is required",
                      minLength: 2,
                      maxLength: 50,
                    })}
                    id="brand"
                    className="input input-bordered w-full"
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-sm">
                      {errors.brand.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="year" className="block font-semibold">
                    Year
                  </label>
                  <input
                    type="number"
                    {...register("year", {
                      required: "Year is required",
                      min: 1900,
                      max: new Date().getFullYear(),
                    })}
                    id="year"
                    className="input input-bordered w-full"
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="model" className="block font-semibold">
                    Model
                  </label>
                  <input
                    type="text"
                    {...register("model", {
                      required: "Car model is required",
                      minLength: 2,
                      maxLength: 50,
                    })}
                    id="model"
                    className="input input-bordered w-full"
                  />
                  {errors.model && (
                    <p className="text-red-500 text-sm">
                      {errors.model.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block font-semibold">
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: 2,
                      maxLength: 150,
                    })}
                    id="description"
                    className="input input-bordered w-full"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="price" className="block font-semibold">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register("price", { required: "Price is required" })}
                    id="price"
                    className="input input-bordered w-full"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="image" className="block font-semibold">
                    Image
                  </label>
                  <input
                    type="file"
                    {...register("image")}
                    id="image"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="btn btn-primary border-none hover:bg-blue-500 transition-colors duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex flex-wrap ml-9 p-5 gap-4 justify-start">
          {allCars?.map((value) => (
            <CarCardAdmin car={value} key={value?._id} />
          ))}
        </div>
      </div>
    </>
  );
};
