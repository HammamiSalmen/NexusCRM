/* import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";

import Img2 from "assets/images/user/avatar-2.png";

export default function Profile() {
  return (
    <>
      <Dropdown className="pc-h-item" align="end">
        <Dropdown.Toggle
          className="pc-head-link arrow-none me-0"
          variant="link"
          id="user-profile-dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="ph ph-user-circle" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
          <Dropdown.Header className="bg-primary">
            <Stack direction="horizontal" gap={3} className="my-2">
              <div className="flex-shrink-0">
                <Image
                  src={Img2}
                  alt="user-avatar"
                  className="user-avatar wid-35"
                  roundedCircle
                />
              </div>
              <Stack gap={1}>
                <h6 className="text-white mb-0">Carson Darrin 🖖</h6>
                <span className="text-white text-opacity-75">
                  carson.darrin@company.io
                </span>
              </Stack>
            </Stack>
          </Dropdown.Header>

          <div className="dropdown-body">
            <div
              className="profile-notification-scroll position-relative"
              style={{ maxHeight: "calc(100vh - 225px)" }}
            >
              <Dropdown.Item as={Link} to="#" className="justify-content-start">
                <i className="ph ph-gear me-2" />
                Settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="#" className="justify-content-start">
                <i className="ph ph-share-network me-2" />
                Share
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="#" className="justify-content-start">
                <i className="ph ph-lock-key me-2" />
                Change Password
              </Dropdown.Item>
              <div className="d-grid my-2">
                <Button>
                  <i className="ph ph-sign-out align-middle me-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
 */
