import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="footer flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full bg-neutral text-neutral-content px-6 py-10 gap-8 sm:gap-16 lg:gap-24">
      <nav className="flex flex-col gap-2">
        <h6 className="footer-title text-lg font-bold">Services</h6>
        <Link to="/" className="link link-hover">Local Car Rentals</Link>
        <Link to="/" className="link link-hover">Outstation Taxi</Link>
        <Link to="/" className="link link-hover">One Way Cab</Link>
        <Link to="/" className="link link-hover">Airport Taxi</Link>
      </nav>

      <nav className="flex flex-col gap-2">
        <h6 className="footer-title text-lg font-bold">Company</h6>
        <Link to="/" className="link link-hover">About us</Link>
        <Link to="/" className="link link-hover">Rent</Link>
        <Link to="/" className="link link-hover">Jobs</Link>
        <Link to="/" className="link link-hover">Refund</Link>
      </nav>

      <nav className="flex flex-col gap-2">
        <h6 className="footer-title text-lg font-bold">Get In Touch</h6>
        <Link to="/contact us" className="link link-hover">Contact Us</Link>
        <Link to="/" className="link link-hover">Travel Agent</Link>
        <Link to="/admin/login" className="link link-hover">Admin</Link>
      </nav>
    </footer>
  )
}