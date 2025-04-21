import React from 'react';
import { useForm } from 'react-hook-form';

export const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // You can replace this with an API or EmailJS integration
    reset();
  };

  return (
    <div className="max-w-xl glass mx-auto mt-10 p-6 rounded-box shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center">Contact Us</h2>
      <p className="text-center text-base-content mb-6">We'd love to hear from you. Fill out the form below.</p>

      {isSubmitSuccessful && (
        <div className="alert alert-success mb-4">
          <span>Thanks! Your message has been sent.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="form-control">
          <label className="label" htmlFor="name">
            <span className="label-text">Full Name :</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email : </span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Message */}
        <div className="form-control">
          <label className="label" htmlFor="message">
            <span className="label-text">Message : </span>
          </label>
          <textarea
            id="message"
            rows="5"
            placeholder="Your message..."
            className={`textarea textarea-bordered ${errors.message ? 'textarea-error' : ''}`}
            {...register('message', { required: 'Message cannot be empty' })}
          ></textarea>
          {errors.message && <p className="text-error text-sm mt-1">{errors.message.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Send Message
        </button>
      </form>

      {/* Contact Info */}
      <div className="mt-10 text-center text-base-content">
        <h3 className="font-semibold text-lg">Our Office</h3>
        <p>123 Main Street, Cityville, USA</p>
        <p>Email: support@rentacar.com</p>
        <p>Phone: +1 (800) 123-4567</p>
      </div>
    </div>
  );
};