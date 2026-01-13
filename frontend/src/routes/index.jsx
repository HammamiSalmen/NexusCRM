import { createBrowserRouter, Navigate } from "react-router-dom";

import ChartMapRoutes from "./ChartMapRoutes";
import ComponentsRoutes from "./ComponentsRoutes";
import FormsRoutes from "./FormsRoutes";
import OtherRoutes from "./OtherRoutes";
import PagesRoutes from "./PagesRoutes";
import NavigationRoutes from "./NavigationRoutes";
import TablesRoutes from "./TablesRoutes";

import ProtectedRoute from "components/ProtectedRoute";
import DashboardLayout from "layout/Dashboard";
import Logout from "views/auth/logout/Logout";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        NavigationRoutes,
        FormsRoutes,
        TablesRoutes,
        ChartMapRoutes,
        ComponentsRoutes,
        OtherRoutes,
      ],
    },

    PagesRoutes,

    {
      path: "/logout",
      element: <Logout />,
    },

    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME,
  },
);

export default router;
