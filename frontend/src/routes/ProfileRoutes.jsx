import { lazy } from "react";
import Loadable from "components/Loadable";

const Profile = Loadable(lazy(() => import("@/sections/profile/Profile")));

const ProfileRoutes = {
  path: "profile",
  element: <Profile />,
};

export default ProfileRoutes;
