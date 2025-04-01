import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { CarCardSkeltons } from "../../components/user/Skeletons";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const Cart = () => {
  const [cartData, isLoading, error] = useFetch("/cart/get-cart-details");
  const errorMessage = error?.response?.data?.message || "Unable To Fetch Cart";

  if (error) return <p>{errorMessage} </p>;
  if (isLoading) {
    return <CarCardSkeltons />;
  }
  

  const handleRemoveCarFromCart= async (carId) => {
    try {
      const response = await axiosInstance({
        method:"DELETE",
        data:{carId},
        url:"/cart/remove-from-cart"
      })
      toast.success("Car Removed From Cart")
      window.location.reload();
    } catch (error) {
        console.log(error);
      toast.error(error?.response?.data?.message || "Unable To Remove Car From Cart");
    }
  }

  return (
    <>
      <div>
        <div className="flex gap-20">
          <div className="w-full">
            {cartData?.cars?.length === 0 ? (
                <div className="flex justify-center items-center h-screen ">    
            <button className="btn btn-info">Drive Now...</button>
                </div>
            ) : (
              cartData?.cars?.map((value) => (
                <div className="flex items-center justify-around glass my-5" key={value?.carId?._id}>
                  <img
                    className="h-40"
                    src={value?.carId?.image}
                    alt="carimg"
                  />
                  <h3>{value?.carId?.name}</h3>
                  <h3>{value?.carId?.description}</h3>
                  <h3>{value?.carId?.price}</h3>
                  <button 
                    className="btn btn-error" 
                    onClick={() => handleRemoveCarFromCart(value?.carId?._id)}>  Remove Car
                  </button>
                  <button className="btn btn-success">Rent Now</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}  