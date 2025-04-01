
import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <>
    <footer className="footer flex justify-center gap-100 items-center sm:footer-horizontal bg-neutral text-neutral-content p-10">
  <nav>
    <h6 className="footer-title">Services</h6>
    <Link to={"/"} className="link link-hover">Local Car Rentals</Link>
    <Link to={"/"} className="link link-hover">Outstation Taxi</Link>
    <Link to={"/"} className="link link-hover">One Way Cab</Link>
    <Link to={"/"} className="link link-hover">Airport Taxi</Link>
  </nav>
  <nav>
    <h6 className="footer-title">Company</h6>
    <Link to={"/"} className="link link-hover">About us</Link>
    <Link to={"/"} className="link link-hover">Rent</Link>
    <Link to={"/"} className="link link-hover">Jobs</Link>
    <Link to={"/"} className="link link-hover">Refund</Link>
  </nav>
  <nav>
    <h6 className="footer-title">Get In Touch</h6>
    <Link to={"/contact us"} className="link link-hover">Contact Us</Link>
    <Link to={"/"} className="link link-hover">Travel Agent</Link>
    <Link to={"/"} className="link link-hover">Site Map</Link>
  </nav>
</footer>
    </>
  )
}
