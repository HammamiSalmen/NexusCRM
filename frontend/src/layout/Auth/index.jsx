import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loader from "components/Loader";

export default function AuthLayout() {
  return (
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  );
}
