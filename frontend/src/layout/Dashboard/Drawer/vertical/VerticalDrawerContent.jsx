import PropTypes from "prop-types";
import SimpleBarScroll from "components/third-party/SimpleBar";
import Navigation from "../DrawerContent";
// import Profile from "../Profile";

export default function VerticalDrawerContent({
  selectedItems,
  setSelectedItems,
}) {
  return (
    <SimpleBarScroll style={{ height: "calc(100vh - 74px)" }}>
      <Navigation
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      {/* <Profile /> */}
    </SimpleBarScroll>
  );
}

VerticalDrawerContent.propTypes = {
  selectedItems: PropTypes.any,
  setSelectedItems: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
};
