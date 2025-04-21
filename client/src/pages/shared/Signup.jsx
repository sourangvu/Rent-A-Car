import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/features/userSlice";
import toast from "react-hot-toast";

export const Signup = ({ role }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = {
    role: "user",
    signupAPI: "/user/signup",
    loginRoute: "/login",
  };

  if (role === "admin") {
    user.role = "admin";
    user.signupAPI = "/admin/signup";
    user.loginRoute = "/admin/login";
  }

  const onSubmit = async (data) => {
    // Create FormData object
    const formData = new FormData();

    // Append regular form data
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("mobile", data.mobile);

    // Append the profile picture file (if selected)
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      formData.append("profilePic", fileInput.files[0]);
    }

    try {
      const response = await axiosInstance.post(user.signupAPI, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Signup Successful:", response.data);
      toast.success("Signup successful!");
      navigate(user.loginRoute);
    } catch (error) {
      setErrorMessage("Error registering user. Please try again.");
      dispatch(clearUser());
      toast.error("Signup failed");
      console.log(error);
    }
  };

  return (
    <div className="bg-base-200 hero min-h-screen">
      <div className="flex-col hero-content">
        <div className="text-center lg:text-left p-5">
          <h1 className="text-5xl font-bold">Sign up now! {user.role}</h1>
        </div>
        <div className="card glass bg-base-100 shadow-2xl w-full max-w-sm shrink-0">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
                className="input input-bordered"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="input input-bordered"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: 6,
                })}
                className="input input-bordered"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Mobile</span>
              </label>
              <input
                type="text"
                placeholder="Mobile"
                {...register("mobile", { required: "Mobile is required" })}
                className="input input-bordered"
              />
              {errors.mobile && (
                <p className="text-red-500">{errors.mobile.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Picture</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="input input-bordered"
              />
            </div>

            <div className="flex form-control mt-6 justify-center">
              <button className="btn btn-primary">Sign Up</button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link to={user.loginRoute} className="link link-hover">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
