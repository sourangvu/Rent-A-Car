import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFetch } from "../../hooks/useFetch";
import { Link, useNavigate } from "react-router-dom";
import { CarCardSkeltons } from "../../components/user/Skeletons";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, isLoading] = useFetch(`/user/profile`);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const profilePicFile = watch("profilePic");

  useEffect(() => {
    if (profilePicFile && profilePicFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(profilePicFile[0]);
    } else {
      setPreview(profileData?.profilePic);
    }
  }, [profilePicFile, profileData]);

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.mobile,
        password: "",
      });
      setPreview(profileData.profilePic);
    }
  }, [profileData, reset]);

  const onSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("password", data.password);
      if (data.profilePic && data.profilePic[0]) {
        formData.append("profilePic", data.profilePic[0]);
      }

      await axiosInstance.put("/user/profile-update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const userId = profileData?._id;
      if (!userId) {
        toast.error("User ID not found.");
        return;
      }

      await axiosInstance.delete(`/user/delete-account/${userId}`);

      toast.success("Account deleted successfully!");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete account."
      );
    }
  };

  if (isLoading) return <CarCardSkeltons />;

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pt-10">
      <div className="card glass w-96 shadow-2xl rounded-2xl backdrop-blur-sm bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
        <figure className="px-10 pt-10">
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-24 h-24 rounded-full ring-4 ring-offset-2 transition-transform transform hover:scale-110 duration-300">
              <img
                src={preview}
                alt="Preview"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </div>
        </figure>

        <div className="card-body items-center text-center p-6 w-full">
          {editMode ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full"
              encType="multipart/form-data"
            >
              <input
                {...register("name", { required: true })}
                className="input input-bordered w-full my-2"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">Name is required</p>
              )}

              <input
                {...register("email", { required: true })}
                className="input input-bordered w-full my-2"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}

              <input
                {...register("mobile", { required: true })}
                className="input input-bordered w-full my-2"
                placeholder="Mobile"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">Mobile is required</p>
              )}

              <input
                {...register("password")}
                type="password"
                className="input input-bordered w-full my-2"
                placeholder="New Password (optional)"
              />

              <input
                type="file"
                accept="image/*"
                {...register("profilePic")}
                className="file-input file-input-bordered w-full my-2"
              />

              <div className="card-actions justify-center gap-4 mt-4">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => setEditMode(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="card-title text-4xl font-semibold text-black mb-3">
                {profileData?.name}
              </h2>
              <h2 className="text-black mb-1">Email : {profileData?.email}</h2>
              <h2 className="text-black">Mobile : {profileData?.mobile}</h2>

              <div className="card-actions justify-center gap-5 mt-5">
                <button
                  className="btn btn-success"
                  onClick={() => setEditMode(true)}
                >
                  Update Profile
                </button>
                <Link to="/">
                  <button className="btn btn-warning">Home</button>
                </Link>
                <button className="btn btn-error" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
