import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Link, useParams } from "react-router-dom";
import { CarCardSkeltons } from "../../components/user/Skeletons";

export const UserProfile = () => {
  const [profileData, isLoading, error] = useFetch(`/user/profile`);
  if (isLoading) {
          return <CarCardSkeltons />;
      }

  return (
    <div className=" flex items-center justify-center h-screen pt-10">

    <div className="card glass  bg-base-100 w-96 shadow-sm">
  <figure className="px-10 pt-10">
    <div className="avatar">
      <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
        <img src={profileData?.profilePic} alt="Profile" />
      </div>
    </div>
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title text-3xl">{profileData?.name}</h2>
    <p>{profileData?.email}</p>
    <p>{profileData?.mobile}</p>
    <div className="card-actions justify-center gap-5">
      <Link to="/update-profile">
        <button className="btn btn-success">Update Profile</button>
      </Link>
      <Link to="/booking">
        <button className="btn btn-warning">Bookings</button>
      </Link>
    </div>
  </div>
</div>
    </div>
  );
};