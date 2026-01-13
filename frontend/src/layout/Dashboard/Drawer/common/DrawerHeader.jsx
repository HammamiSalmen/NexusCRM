import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { APP_DEFAULT_PATH } from "config";
import logo from "assets/images/logo-white.svg";

export const DrawerHeader = () => {
  return (
    <div className="m-header">
      <Link to={APP_DEFAULT_PATH} className="b-brand text-primary">
        <Image src={logo} fluid className="logo logo-lg" alt="logo" />
      </Link>
    </div>
  );
};
