import { lazy } from "react";
// import DashboardLayout from "layout/Dashboard";
import Loadable from "components/Loadable";

const FormBasic = Loadable(
  lazy(() => import("views/forms/form-element/FormBasic")),
);

const FormsRoutes = {
  path: "forms",
  children: [
    {
      path: "form-elements",
      children: [{ path: "basic", element: <FormBasic /> }],
    },
  ],
};

export default FormsRoutes;
