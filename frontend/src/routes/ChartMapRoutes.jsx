import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";

const ApexChart = Loadable(lazy(() => import("views/charts/ApexChart")));
const Kanban = Loadable(lazy(() => import("views/KanbanBoard/Kanban")));
const ChartMapRoutes = {
  path: "informations", // Parent
  children: [
    {
      path: "to-do/kanban",
      element: <Kanban />,
    },
    {
      path: "statistiques/graphs",
      element: <ApexChart />,
    },
  ],
};

export default ChartMapRoutes;
