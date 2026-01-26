import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Nav, Stack, Image, Form } from "react-bootstrap";
import { handlerDrawerOpen, useGetMenuMaster } from "api/menu";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "api/api";
import SimpleBarScroll from "components/third-party/SimpleBar";
import Img1 from "assets/images/user/avatar-1.png";
import { toggleTheme, getTheme } from "utils/theme";

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

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " ans";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " mois";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " jours";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " heures";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes";
  return Math.floor(seconds) + " secondes";
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

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    clients: [],
    users: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [theme, setThemeState] = useState(getTheme());

  const handleThemeToggle = () => {
    const nextTheme = toggleTheme();
    setThemeState(nextTheme);
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/api/notifications/");
      setNotifications(response.data);
      const unread = response.data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error("Erreur chargement notifications", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await api.post("/api/notifications/mark_all_read/");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur mark all read", error);
    }
  };

  const handleClearAll = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.delete("/api/notifications/delete_all/");
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.post(`/api/notifications/${notif.id}/mark_read/`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Erreur lors du marquage comme lu", error);
      }
    }

    if (notif.link) {
      navigate(notif.link);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const promises = [api.get(`/api/clients/?search=${searchQuery}`)];
          if (user.is_superuser) {
            promises.push(api.get(`/api/users/?search=${searchQuery}`));
          }
          const results = await Promise.all(promises);
          setSearchResults({
            clients: results[0].data,
            users: user.is_superuser && results[1] ? results[1].data : [],
          });
        } catch (error) {
          console.error("Erreur recherche", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ clients: [], users: [] });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user.is_superuser]);

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
                onClick={() => handlerDrawerOpen(!drawerOpen)}
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
                    placeholder="Rechercher un client ou un employé..."
                    className="border-0 shadow-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </Form>
                <SimpleBarScroll style={{ maxHeight: "300px" }}>
                  {searchResults.clients.length > 0 ||
                  searchResults.users.length > 0 ? (
                    <div className="p-3">
                      {searchResults.clients.length > 0 && (
                        <>
                          <h6 className="text-muted text-uppercase small">
                            Clients
                          </h6>
                          <div className="list-group mb-3">
                            {searchResults.clients.map((client) => (
                              <Link
                                key={client.id}
                                to={`/tables/details-client/${client.id}`}
                                className="list-group-item list-group-item-action border-0 px-2 py-1"
                              >
                                <i className="ph ph-briefcase me-2 text-primary" />
                                {client.nomClient}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                      {searchResults.users.length > 0 && (
                        <>
                          <h6 className="text-muted text-uppercase small">
                            Employés
                          </h6>
                          <div className="list-group">
                            {searchResults.users.map((u) => (
                              <Link
                                key={u.id}
                                to={`/tables/details-employe/${u.id}`}
                                className="list-group-item list-group-item-action border-0 px-2 py-1"
                              >
                                <i className="ph ph-user me-2 text-success" />
                                {u.username}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    searchQuery.length > 2 &&
                    !isSearching && (
                      <div className="text-center p-3 text-muted">
                        Aucun résultat trouvé
                      </div>
                    )
                  )}
                </SimpleBarScroll>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
        <div className="ms-auto">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item">
              <Button
                variant="link"
                className="pc-head-link"
                onClick={handleThemeToggle}
              >
                <i
                  className={`ph ${theme === "dark" ? "ph-sun" : "ph-moon"}`}
                />
              </Button>
            </Nav.Item>
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle
                className="pc-head-link me-0 arrow-none"
                variant="link"
                id="notification-dropdown"
              >
                <i className="ph ph-bell" />
                {unreadCount > 0 && (
                  <span className="badge bg-danger pc-h-badge">
                    {unreadCount}
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-notification pc-h-dropdown">
                <Dropdown.Header className="d-flex align-items-center justify-content-between">
                  <h5 className="m-0">Notifications</h5>
                  <Link
                    className="btn btn-link btn-sm"
                    to="#"
                    onClick={handleMarkAllRead}
                  >
                    Tout marquer comme lu
                  </Link>
                </Dropdown.Header>
                <SimpleBarScroll style={{ maxHeight: "calc(100vh - 215px)" }}>
                  <div className="dropdown-body text-wrap position-relative">
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        Aucune nouvelle notification
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-3 border-bottom ${!notification.read ? "bg-light-primary" : ""}`}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            borderLeft: !notification.read
                              ? "4px solid #4680ff"
                              : "4px solid transparent",
                            display: "block",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.filter = "brightness(0.95)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.filter = "none")
                          }
                        >
                          <Stack
                            direction="horizontal"
                            gap={3}
                            style={{ pointerEvents: "none" }}
                          >
                            <div className="flex-shrink-0">
                              <Image
                                className="img-radius avatar rounded-circle"
                                src={Img1}
                                alt="Notification"
                                style={{ width: "40px", height: "40px" }}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <span className="float-end text-sm text-muted">
                                {timeSince(notification.created_at)}
                              </span>
                              <h5
                                className={`text-body mb-1 ${!notification.read ? "fw-bold" : ""}`}
                              >
                                {notification.title}
                              </h5>
                              <p className="mb-0 text-muted small">
                                {notification.message}
                              </p>
                            </div>
                          </Stack>
                        </div>
                      ))
                    )}
                  </div>
                </SimpleBarScroll>
                <div className="text-center py-2 border-top">
                  <Link
                    to="#!"
                    className="link-danger small fw-bold"
                    onClick={handleClearAll}
                  >
                    Supprimer toutes les notifications
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
                      <i className="ti ti-user me-2 fs-5" /> Mon profil
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
