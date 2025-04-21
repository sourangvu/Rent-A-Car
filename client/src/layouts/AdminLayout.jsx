import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/user/Header';
import { Footer } from '../components/user/Footer';
import { axiosInstance } from '../config/axiosInstance';
import { AdminHeader } from '../components/admin/AdminHeader';
import { clearAdmin, saveAdmin } from '../redux/features/adminSlice';

export const AdminLayout = () => {

  const location = useLocation();
  const adminState = useSelector((state) => state.admin); // Get the full admin state
  const { isAdminAuth } = adminState || {}; // Safe destructuring
  const dispatch = useDispatch();

  const checkAdmin = async () => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: "/admin/check-admin",
      });
      console.log(response, "=====checkAdmin");
      dispatch(saveAdmin(response.data));
    } catch (error) {
      console.log(error);
      dispatch(clearAdmin());
    }
  };

  useEffect(() => {
    checkAdmin();
  }, [location.pathname]);
  return (
    <div>
    {isAdminAuth ? <AdminHeader /> : <Header />}

    <div className="min-h-100">
      <Outlet />
    </div>

    <Footer />
  </div>
  )
}
