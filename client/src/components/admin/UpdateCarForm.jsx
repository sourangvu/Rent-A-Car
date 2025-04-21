import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"; 
import { useFetch } from "../../hooks/useFetch";

export const UpdateCarForm = () => {
  const { carId } = useParams(); 
  const navigate = useNavigate();

  // Fetching car data using useFetch
  const { data: car, isLoading, error } = useFetch(`/api/cars/${carId}`);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Handle form submission to update the car
  const onSubmit = async (updatedCar) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCar),
      });
      if (!response.ok) {
        throw new Error("Failed to update car");
      }
      // Redirect to car details or list after successful update
      navigate(`/cars/${carId}`);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // While the car data is loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If there's an error fetching the car data
  if (error) {
    return <div>Error: {error}</div>;
  }


  useEffect(() => {
    if (car) {
      setValue("name", car.name);
      setValue("brand", car.brand);
      setValue("year", car.year);
      setValue("model", car.model);
      setValue("description", car.description);
      setValue("price", car.price);
      setValue("image", car.image);
    }
  }, [car, setValue]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card glass bg-base-100 p-8 rounded-3xl w-1/2">
        <h2 className="text-3xl font-semibold text-center mb-5">Update Car</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">Car Name</label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Car name is required" })}
              className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="brand" className="block font-medium">Brand</label>
            <input
              type="text"
              id="brand"
              {...register("brand", { required: "Brand is required" })}
              className={`input input-bordered w-full ${errors.brand ? "input-error" : ""}`}
            />
            {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="year" className="block font-medium">Year</label>
            <input
              type="text"
              id="year"
              {...register("year", { required: "Year is required" })}
              className={`input input-bordered w-full ${errors.year ? "input-error" : ""}`}
            />
            {errors.year && <span className="text-red-500">{errors.year.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="model" className="block font-medium">Model</label>
            <input
              type="text"
              id="model"
              {...register("model", { required: "Model is required" })}
              className={`input input-bordered w-full ${errors.model ? "input-error" : ""}`}
            />
            {errors.model && <span className="text-red-500">{errors.model.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block font-medium">Description</label>
            <textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              className={`textarea textarea-bordered w-full ${errors.description ? "textarea-error" : ""}`}
            />
            {errors.description && <span className="text-red-500">{errors.description.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block font-medium">Price per Day</label>
            <input
              type="text"
              id="price"
              {...register("price", { required: "Price is required" })}
              className={`input input-bordered w-full ${errors.price ? "input-error" : ""}`}
            />
            {errors.price && <span className="text-red-500">{errors.price.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block font-medium">Image URL</label>
            <input
              type="text"
              id="image"
              {...register("image", { required: "Image URL is required" })}
              className={`input input-bordered w-full ${errors.image ? "input-error" : ""}`}
            />
            {errors.image && <span className="text-red-500">{errors.image.message}</span>}
          </div>

          <div className="flex justify-between gap-5 mt-5">
            <button type="submit" className="btn btn-primary w-1/2">
              Update Car
            </button>
            <button
              type="button"
              onClick={() => navigate(`/cars/${carId}`)}
              className="btn btn-secondary w-1/2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};