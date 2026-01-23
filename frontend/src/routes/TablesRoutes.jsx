import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";
import AdminRoute from "components/AdminRoute";

const TableClients = Loadable(lazy(() => import("views/table/TableClients")));
const CreerClient = Loadable(
  lazy(() => import("@/sections/clients/CreerClient")),
);
const DetailsClient = Loadable(
  lazy(() => import("sections/clients/DetailsClient")),
);
const EmployesTable = Loadable(lazy(() => import("views/table/EmployesTable")));
const CreerEmploye = Loadable(
  lazy(() => import("@/sections/employes/CreerEmploye")),
);
const DetailsEmploye = Loadable(
  lazy(() => import("sections/employes/DetailsEmploye")),
);

const TablesRoutes = {
  path: "tables",
  children: [
    {
      path: "Table-clients",
      element: <TableClients />,
    },
    {
      path: "Creer-client",
      element: <CreerClient />,
    },
    {
      path: "Details-client/:id",
      element: <DetailsClient />,
    },
    {
      element: <AdminRoute />,
      children: [
        { path: "employes-table", element: <EmployesTable /> },
        { path: "creer-employe", element: <CreerEmploye /> },
        { path: "details-employe/:id", element: <DetailsEmploye /> },
      ],
    },
  ],
};

export default TablesRoutes;
