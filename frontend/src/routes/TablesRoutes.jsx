import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";

const ClientsTable = Loadable(lazy(() => import("views/table/ClientsTable")));
const CreerClient = Loadable(
  lazy(() => import("@/sections/clients/CreerClient"))
);
const DetailsClient = Loadable(
  lazy(() => import("sections/clients/DetailsClient"))
);
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
      path: "creer-client",
      element: <CreerClient />,
    },
    {
      path: "details-client/:id",
      element: <DetailsClient />,
    },
    {
      path: "employes-table",
      element: <EmployesTable />,
    },
  ],
};

export default TablesRoutes;
