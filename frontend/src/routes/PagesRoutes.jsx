import { lazy } from "react";
import Loadable from "components/Loadable";
import AuthLayout from "layout/Auth";

const Login = Loadable(lazy(() => import("views/auth/login/Login")));
const Register = Loadable(lazy(() => import("views/auth/register/Register")));
const Logout = Loadable(lazy(() => import("views/auth/logout/Logout")));

const PagesRoutes = {
  path: "/",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "logout", element: <Logout /> },
  ],
};

export default PagesRoutes;
