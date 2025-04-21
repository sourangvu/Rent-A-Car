import React from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const ForgotPassword = ({ role }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      // Add role to the payload so the backend knows who it is
      const payload = { ...data, role };

      await axiosInstance.post("/forgot-password", payload);
      toast.success("Reset link sent to your email");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <h1 className="text-4xl font-bold mb-4">Forgot Password</h1>
        <form
          className="card glass bg-base-100 p-6 shadow-lg w-96"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enter your email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: true })}
              className="input input-bordered"
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Send Reset Link</button>
          </div>
        </form>
      </div>
    </div>
  );
};
