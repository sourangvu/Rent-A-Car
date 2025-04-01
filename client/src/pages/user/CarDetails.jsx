import React from 'react'
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { CarCardSkeltons } from '../../components/user/Skeletons';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../config/axiosInstance';

export const CarDetails = () => {
    const params = useParams();

    const [carDetails, isLoading, error] = useFetch(`/car/getCarDetails/${params?.id}`);
    console.log(params.id);
    
  
    
     if (isLoading) {
            return <CarCardSkeltons />;
        }

        const handleAddToCart = async () => {
          try {
              const response = await axiosInstance({ 
                method: "POST", 
                data: { carId: params?.id }, 
                url: "/cart/add-to-cart" });
              console.log(response, "=====add to cart RES");
              toast.success("Car Added To Cart");
          } catch (error) {
              console.log(error);
              toast.error(error?.response?.data?.message || "Unable To Add Car To Cart");
          }
      };

      return (
        <>
          <h1 className="text-center font-bold text-4xl">Car Details</h1>
          <div className='flex justify-center p-10'>
            <div className="card glass bg-base-100 w-96 shadow-sm w-fit">
              <figure className="px-10 pt-10">
                <img
                  src={carDetails?.image}
                  alt="cars"
                  className="rounded-xl transition-transform duration-300 transform hover:scale-110 hover:shadow-lg" />
              </figure>
              <div className="card-body items-center text-center">
                <h1 className="card-title text-4xl">{carDetails?.name}</h1>
                <h2 className='text-2xl' >{carDetails?.description}</h2>
                <h2 className='text-2xl text-green-500'>Pay-{carDetails?.price}/Day</h2>
                <div className="card-actions">
                  <div className="card-actions justify-end gap-100">
                    <button
                      className="btn btn-error transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600"
                      onClick={() => Navigate(`/carBooking/${carDetails?._id}`)}>
                      Book Now
                    </button>
                    <button
                      className="btn btn-info transition duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-500"
                      onClick={handleAddToCart}>
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
