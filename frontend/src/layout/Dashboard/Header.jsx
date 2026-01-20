import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Nav, Stack, Image, Form } from "react-bootstrap";
import { handlerDrawerOpen, useGetMenuMaster } from "api/menu";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

import MainCard from "components/MainCard";
import SimpleBarScroll from "components/third-party/SimpleBar";

import Img1 from "assets/images/user/avatar-1.png";
import Img2 from "assets/images/user/avatar-2.png";
import Img3 from "assets/images/user/avatar-3.png";
import Img4 from "assets/images/user/avatar-4.png";
import Img5 from "assets/images/user/avatar-5.png";

const notifications = [
  {
    id: 1,
    avatar: Img1,
    time: "2 min ago",
    title: "UI/UX Design",
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: "Today",
  },
  {
    id: 2,
    avatar: Img2,
    time: "1 hour ago",
    title: "Message",
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: "Today",
  },
  {
    id: 3,
    avatar: Img3,
    time: "2 hour ago",
    title: "Forms",
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: "Yesterday",
  },
  {
    id: 4,
    avatar: Img4,
    time: "12 hour ago",
    title: "Challenge invitation",
    description: "Jonny aber invites you to join the challenge",
    actions: true,
    date: "Yesterday",
  },
  {
    id: 5,
    avatar: Img5,
    time: "5 hour ago",
    title: "Security",
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: "Yesterday",
  },
];

const getAvatarColor = (name = "") => {
  const colors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#e67e22",
    "#e74c3c",
    "#95a5a6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash % colors.length)];
};

const getInitials = (name = "") => {
  if (!name) return "?";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export default function Header() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.username ||
    "Utilisateur";

  const handleLogoutClick = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="pc-header">
      <div className="header-wrapper">
        <div className="me-auto pc-mob-drp">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item pc-sidebar-collapse">
              <Nav.Link
                as={Link}
                to="#"
                className="pc-head-link ms-0"
                id="sidebar-hide"
                onClick={() => {
                  handlerDrawerOpen(!drawerOpen);
                }}
              >
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="pc-h-item pc-sidebar-popup">
              <Nav.Link
                as={Link}
                to="#"
                className="pc-head-link ms-0"
                id="mobile-collapse"
                onClick={() => handlerDrawerOpen(!drawerOpen)}
              >
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Dropdown className="pc-h-item dropdown">
              <Dropdown.Toggle
                variant="link"
                className="pc-head-link arrow-none m-0 trig-drp-search"
                id="dropdown-search"
              >
                <i className="ph ph-magnifying-glass" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown drp-search">
                <Form className="px-3 py-2">
                  <Form.Control
                    type="search"
                    placeholder="Search here. . ."
                    className="border-0 shadow-none"
                  />
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
        <div className="ms-auto">
          <Nav className="list-unstyled">
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle
                className="pc-head-link me-0 arrow-none"
                variant="link"
                id="notification-dropdown"
              >
                <i className="ph ph-bell" />
                <span className="badge bg-success pc-h-badge">3</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-notification pc-h-dropdown">
                <Dropdown.Header className="d-flex align-items-center justify-content-between">
                  <h5 className="m-0">Notifications</h5>
                  <Link className="btn btn-link btn-sm" to="#">
                    Mark all read
                  </Link>
                </Dropdown.Header>
                <SimpleBarScroll style={{ maxHeight: "calc(100vh - 215px)" }}>
                  <div className="dropdown-body text-wrap position-relative">
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        {index === 0 ||
                        notifications[index - 1].date !== notification.date ? (
                          <p className="text-span">{notification.date}</p>
                        ) : null}
                        <MainCard className="mb-0">
                          <Stack direction="horizontal" gap={3}>
                            <Image
                              className="img-radius avatar rounded-0"
                              src={notification.avatar}
                              alt="Generic placeholder image"
                            />
                            <div>
                              <span className="float-end text-sm text-muted">
                                {notification.time}
                              </span>
                              <h5 className="text-body mb-2">
                                {notification.title}
                              </h5>
                              <p className="mb-0">{notification.description}</p>
                              {notification.actions && (
                                <div className="mt-2">
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                  >
                                    Decline
                                  </Button>
                                  <Button variant="primary" size="sm">
                                    Accept
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Stack>
                        </MainCard>
                      </React.Fragment>
                    ))}
                  </div>
                </SimpleBarScroll>

                <div className="text-center py-2">
                  <Link to="#!" className="link-danger">
                    Clear all Notifications
                  </Link>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle
                className="btn btn-link arrow-none me-0 border-0 p-0 shadow-none bg-transparent"
                variant="link"
                id="user-profile-dropdown"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{
                    margin: 12,
                    width: "35px",
                    height: "35px",
                    backgroundColor: getAvatarColor(fullName),
                    fontSize: "12px",
                  }}
                >
                  {getInitials(fullName)}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
                <Dropdown.Header className="bg-primary">
                  <Stack direction="horizontal" gap={3} className="my-2">
                    <div className="flex-shrink-0">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-primary bg-white fw-bold shadow-sm"
                        style={{
                          width: "45px",
                          height: "45px",
                          fontSize: "16px",
                        }}
                      >
                        {getInitials(fullName)}
                      </div>
                    </div>
                    <Stack gap={1}>
                      <h6 className="text-white mb-0">{fullName}</h6>
                      <span className="text-white text-opacity-75 small">
                        {user.email || ""}
                      </span>
                    </Stack>
                  </Stack>
                </Dropdown.Header>

                <div className="dropdown-body">
                  <div
                    className="profile-notification-scroll position-relative"
                    style={{ maxHeight: "calc(100vh - 225px)" }}
                  >
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      className="justify-content-start py-2"
                    >
                      <i className="ti ti-user me-2 fs-5" /> Mon Profil
                    </Dropdown.Item>

                    <div className="d-grid my-2 px-3">
                      <Button
                        onClick={handleLogoutClick}
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center justify-content-center"
                      >
                        <i className="ti ti-logout me-2" /> Déconnexion
                      </Button>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </div>
    </header>
  );
}
