import informations from "./informations";
// import formComponents from "./forms";
// import other from "./other";
// import pages from "./pages";
// import uiComponents from "./ui-components";
import tableRoutes from "./tables";
import navigation from "./navigation";
import profileMenu from "./profile";

const menuItems = {
  items: [
    navigation,
    // uiComponents,
    // formComponents,
    tableRoutes,
    informations,
    { ...profileMenu, hideInMenu: true },
    // pages,
    // other,
  ],
};

export default menuItems;
