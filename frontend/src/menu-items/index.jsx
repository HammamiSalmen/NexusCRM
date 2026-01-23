import navigation from "./navigation";
import profileMenu from "./profile";

const menuItems = {
  items: [navigation, { ...profileMenu, hideInMenu: true }],
};

export default menuItems;
