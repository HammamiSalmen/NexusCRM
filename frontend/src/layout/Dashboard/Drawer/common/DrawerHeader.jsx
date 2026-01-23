import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { APP_DEFAULT_PATH } from "config";
import logo from "assets/images/Chatt.png";

export const DrawerHeader = () => {
  return (
    <div className="m-header">
      <Link
        to={APP_DEFAULT_PATH}
        className="b-brand text-primary d-flex justify-content-center align-items-center"
      >
        <Image
          src={logo}
          fluid
          className="logo logo-lg"
          alt="logo"
          style={{
            maxHeight: "100%",
            marginRight: "30px",
          }}
        />
      </Link>
    </div>
  );
};
