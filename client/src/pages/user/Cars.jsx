import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { CarCard } from "../../components/user/CarCard";
import { CarCardSkeltons } from "../../components/user/Skeletons";

export const Cars = () => {
    
    const [allCars, isLoading, error] = useFetch("/car/getAllCars");

    if (isLoading) {
        return <CarCardSkeltons />;
    }

    return (
        <>
            <h1 className="text-center font-bold text-4xl">Available Cars</h1>
        <div className="flex flex-wrap ml-9 p-5 gap-4 justify-start">

            {allCars?.map((value) => (
                
                <CarCard car={value} key={value?._id} />
            ))}
        </div>
            </>
    );
};