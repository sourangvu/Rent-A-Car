import { createBrowserRouter, useLocation } from "react-router-dom";
import { About } from "../pages/user/About";
import { Contact } from "../pages/user/Contact";
import { Home } from "../pages/user/Home";
import { RootLayout } from "../layouts/RootLayout";
import { ErrorPage } from "../pages/shared/ErrorPage";
import { Login } from "../pages/shared/Login";
import { UserProfile } from "../pages/user/UserProfile";
import { Cars } from "../pages/user/Cars";
import { CarDetails } from "../pages/user/CarDetails";
import { AdminLayout } from "../layouts/AdminLayout";
import { Signup } from "../pages/shared/Signup";
import { Logout } from "../pages/shared/Logout";
import { AdminProfile } from "../pages/admin/AdminProfile";
import { Cart } from "../pages/user/Cart";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { Bookings } from "../pages/user/Bookings";
import { AllCars } from "../pages/admin/AllCars";
import { AllBookings } from "../pages/admin/AllBookings";
import { AllUsers } from "../pages/admin/AllUsers";
import { PaymentSuccess } from "../pages/user/PaymentSuccess";
import { AdminHome } from "../pages/admin/AdminHome.";
import { Reviews } from "../pages/user/Reviews";
import { ForgotPassword } from "../pages/shared/ForgotPassword";

const ForgotPasswordWrapper = () => {
  const query = new URLSearchParams(useLocation().search);
  const role = query.get("role") || "user";
  return <ForgotPassword role={role} />;
};

export const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordWrapper />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "cars",
        element: <Cars />,
      },
      {
        path: "carDetails/:id",
        element: <CarDetails />,
      },

      {
        path: "user",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "profile",
            element: <UserProfile />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "booking",
            element: <Bookings />,
          },
          {
            path: "review",
            element: <Reviews />,
          },
          {
            path: "payment",
            element: <h1>payment</h1>,
          },
          {
            path: "payment/success",
            element: <PaymentSuccess />,
          },
          {
            path: "payment/cancel",
            element: <h1>Payment Failed</h1>,
          },
          {
            path: "logout",
            element: <Logout />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin",
        element: <AdminHome />,
      },
      {
        path: "/admin/signup",
        element: <Signup role="admin" />,
      },
      {
        path: "/admin/login",
        element: <Login role="admin" />,
      },
      {
        path: "/admin/logout",
        element: <Logout role="admin" />,
      },
      {
        path: "/admin/profile",
        element: <AdminProfile role="admin" />,
      },
      {
        path: "/admin/cars",
        element: <AllCars role="admin" />,
      },
      {
        path: "/admin/booking",
        element: <AllBookings role="admin" />,
      },
      {
        path: "/admin/user",
        element: <AllUsers role="admin" />,
      },
    ],
  },
]);
