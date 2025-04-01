import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axiosInstance";

export const useFetch = (url) => {
    
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // api call function
    const fetchData = async () => {
        try {
            const response = await axiosInstance({ method: "GET", url: url });
            setData(response?.data?.data);
            setTimeout(()=>{
                setIsLoading(false);
            },1000)
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    //useEffect
    useEffect(() => {
        fetchData();
    }, []);

    return [data, isLoading, error];
};