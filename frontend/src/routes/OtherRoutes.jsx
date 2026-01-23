import { lazy } from "react";
import Loadable from "components/Loadable";
// import DashboardLayout from "layout/Dashboard";

const OtherSamplePage = Loadable(lazy(() => import("views/SamplePage")));
const OtherRoutes = {
  path: "other",
  children: [
    {
      path: "sample-page",
      element: <OtherSamplePage />,
    },
  ],
};

export default OtherRoutes;
