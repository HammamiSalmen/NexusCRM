import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";

const Taches = Loadable(lazy(() => import("views/taches/Taches")));
const ChartMapRoutes = {
  path: "", // Parent
  children: [
    {
      path: "Tâches",
      element: <Taches />,
    },
  ],
};

export default ChartMapRoutes;
