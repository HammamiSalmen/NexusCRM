import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";
import Footer from "./Footer";
import Header from "./Header";
import Breadcrumbs from "components/Breadcrumbs";
import NavigationScroll from "components/NavigationScroll";

export default function MainLayout() {
  return (
    <>
      <Drawer />
      <Header />
      <div className="pc-container">
        <div className="pc-content">
          <Breadcrumbs />
          <NavigationScroll>
            <Outlet />
          </NavigationScroll>
        </div>
      </div>
      <Footer />
    </>
  );
}
