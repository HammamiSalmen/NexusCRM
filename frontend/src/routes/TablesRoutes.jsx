import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";

const BootstrapTableBasic = Loadable(
  lazy(() => import("views/table/bootstrap-table/BasicTable")),
);

const TablesRoutes = {
  path: "tables",
  children: [
    {
      path: "bootstrap-table",
      children: [{ path: "basic-table", element: <BootstrapTableBasic /> }],
    },
  ],
};

export default TablesRoutes;
