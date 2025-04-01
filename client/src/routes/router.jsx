import { createBrowserRouter } from "react-router-dom";
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
import { AdminHome } from "../pages/admin/AdminHome.";
import { Signup } from "../pages/shared/Signup";
import { Logout } from "../pages/shared/Logout";
import { AdminProfile } from "../pages/admin/AdminProfile";
import { Cart } from "../pages/user/Cart";
import { ProtectedRoutes } from "./ProtectedRoutes";

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
            path: "logout",
            element: <Logout />,
          },
          {
            path: "payment",
            element: <h1>payment</h1>,
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
    ],
  },
]);
