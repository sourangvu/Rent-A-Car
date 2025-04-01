import React from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../config/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser, saveUser } from "../../redux/features/userSlice";
import toast from "react-hot-toast";

export const Login = ({ role }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = {
    role: "user",
    loginAPI: "/user/login",
    profileRoute: "/user/profile",
    signupRoute: "/signup",
  };

  if (role == "admin") {
    user.role = "admin";
    user.loginAPI = "/admin/login";
    (user.profileRoute = "/admin/profile"),
      (user.signupRoute = "/admin/signup");
  }

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const response = await axiosInstance({
        method: "PUT",
        url: user.loginAPI,
        data: data,
      });
      console.log("response====", response);
      dispatch(saveUser(response?.data?.data));
      toast.success("Login success");
      navigate(user.profileRoute);
    } catch (error) {
      dispatch(clearUser());
      toast.error("Login Failed");
      console.log(error);
    }
  };

  return (
    <div className="bg-base-200 hero min-h-screen">
      <div className="flex-col hero-content">
        <div className="text-center lg:text-left p-5">
          <h1 className="text-5xl font-bold">Login now! {user.role} </h1>
        </div>
        <div className="card glass bg-base-100 shadow-2xl w-full max-w-sm shrink-0">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                {...register("email")}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                {...register("password")}
                className="input input-bordered"
                required
              />

              <div className="flex justify-between items-center">
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
                <label className="label">
                  <Link to={user.signupRoute} className="label-text-alt link link-hover">
                      New User?     
                  </Link>
                </label>
              </div>
            </div>
            <div className="flex form-control mt-6 justify-center">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
      </div>
  );
};
