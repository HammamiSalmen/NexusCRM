import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";

const ClientsTable = Loadable(lazy(() => import("views/table/ClientsTable")));
const EmployesTable = Loadable(lazy(() => import("views/table/EmployesTable")));

const TablesRoutes = {
  path: "tables",
  children: [
    {
      path: "clients-table",
      element: <ClientsTable />,
      // children: [{ path: "basic-table", element: <BootstrapTableBasic /> }],
    },
    {
      path: "employes-table",
      element: <EmployesTable />,
      // children: [{ path: "basic-table", element: <BootstrapTableBasic /> }],
    },
  ],
};

export default TablesRoutes;
