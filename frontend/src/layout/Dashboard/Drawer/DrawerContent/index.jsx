import PropTypes from "prop-types";
import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup";
import menuItems from "menu-items";

export default function Navigation({
  selectedItems,
  setSelectedItems,
  setSelectTab,
}) {
  const [selectedID, setSelectedID] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(0);

  const lastItem = null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items
      .slice(lastItem - 1, menuItems.items.length)
      .map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        elements: item.children,
        icon: item.icon,
        ...(item.url && {
          url: item.url,
        }),
      }));
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperUser = user?.is_superuser;

  const navGroups = menuItems.items
    .slice(0, lastItemIndex + 1)
    .filter((item) => {
      if (item.hideInMenu) return false;
      if (item.requiresAdmin && !isSuperUser) return false;
      return true;
    })
    .map((item) => {
      if (item.children) {
        item.children = item.children.filter(
          (child) => !child.requiresAdmin || isSuperUser,
        );
      }
      switch (item.type) {
        case "group":
          if (item.url && item.id !== lastItemId) {
            return (
              <ListGroup.Item key={item.id}>
                <NavItem item={item} level={1} isParents />
              </ListGroup.Item>
            );
          }

          return (
            <NavGroup
              key={item.id}
              setSelectedID={setSelectedID}
              setSelectedItems={setSelectedItems}
              setSelectedLevel={setSelectedLevel}
              selectedLevel={selectedLevel}
              selectedID={selectedID}
              selectedItems={selectedItems}
              lastItem={lastItem}
              remItems={remItems}
              lastItemId={lastItemId}
              item={item}
              setSelectTab={setSelectTab ?? (() => {})}
            />
          );
      }

      return (
        <h6 key={item.id} className="text-danger align-items-center">
          Fix - Navigation Group
        </h6>
      );
    });

  return <ul className="pc-navbar">{navGroups}</ul>;
}

Navigation.propTypes = {
  selectedItems: PropTypes.any,
  setSelectedItems: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
  setSelectTab: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
};
