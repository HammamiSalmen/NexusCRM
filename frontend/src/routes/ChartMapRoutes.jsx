import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";

const ApexChart = Loadable(lazy(() => import("views/charts/ApexChart")));
const ChartMapRoutes = {
  path: "charts",
  children: [
    {
      path: "apex-chart",
      element: <ApexChart />,
    },
  ],
};

export default ChartMapRoutes;
