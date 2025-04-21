import React from "react";
import { UserCardAdmin } from "../../components/user/CarCard";
import { useFetch } from "../../hooks/useFetch";
import { CarCardSkeltons } from "../../components/user/Skeletons";

export const AllUsers = () => {
  const [allUsers, isLoading, error] = useFetch("/user/getAllUsers");

  if (isLoading) {
    return <CarCardSkeltons />;
  }

  return (
    <>
      <div className="w-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pt-10">
        <h1 className="text-center font-bold text-4xl">All Users</h1>
        <div className="flex flex-wrap ml-9 p-5 gap-4 justify-start">
          {allUsers?.map((user) => (
            <UserCardAdmin user={user} key={user?._id} />
          ))}
        </div>
      </div>
    </>
  );
};
