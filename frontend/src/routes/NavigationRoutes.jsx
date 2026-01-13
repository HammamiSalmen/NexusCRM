import { lazy } from "react";
import Loadable from "components/Loadable";
// import DashboardLayout from "layout/Dashboard";
// import ProtectedRoute from "components/ProtectedRoute";

const DefaultPages = Loadable(
  lazy(() => import("views/navigation/dashboard/Default")),
);

const NavigationRoutes = {
  children: [
    {
      path: "/",
      element: <DefaultPages />,
    },
  ],
};

export default NavigationRoutes;
