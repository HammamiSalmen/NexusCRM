/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Badge,
  Form,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "api/api";
import toast from "react-hot-toast";
import MainCard from "components/MainCard";

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
  if (!name) return "";
  const names = name.trim().split(" ");
  return names.length === 1
    ? names[0].charAt(0).toUpperCase()
    : (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const AvatarPro = ({ name }) => (
  <div
    className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
    style={{
      width: "35px",
      height: "35px",
      backgroundColor: getAvatarColor(name),
      fontSize: "14px",
    }}
  >
    {getInitials(name)}
  </div>
);

export default function EmployesTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("name-asc");
  const [roleFilter, setRoleFilter] = useState("all");

  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.is_superuser) {
        toast.error("Accès non autorisé");
        return navigate("/dashboard");
      }
      const response = await api.get("/api/users/");
      setEmployees(response.data);
    } catch (error) {
      toast.error("Erreur chargement employés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getProcessedEmployees = () => {
    let filtered = [...employees];
    if (roleFilter === "admin") {
      filtered = filtered.filter((emp) => emp.is_superuser);
    } else if (roleFilter === "staff") {
      filtered = filtered.filter((emp) => !emp.is_superuser);
    }
    filtered.sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      switch (sortType) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "date-asc":
          return new Date(a.date_joined) - new Date(b.date_joined);
        case "date-desc":
          return new Date(b.date_joined) - new Date(a.date_joined);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const sortLabels = {
    "date-desc": "Plus récents",
    "date-asc": "Plus anciens",
    "name-asc": "Nom (A-Z)",
    "name-desc": "Nom (Z-A)",
  };

  const processedEmployees = getProcessedEmployees();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = processedEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(processedEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className="mb-4"
        onClick={() => navigate("/tables/creer-employe")}
      >
        <i className="ph ph-plus-circle me-1" /> Créer un nouvel employé
      </Button>
      <MainCard
        title={
          <Row className="align-items-center g-3">
            <Col md={4}></Col>
            <Col
              md={8}
              className="d-flex justify-content-md-end align-items-center gap-3"
            >
              <div className="bg-light p-1 rounded-3 d-flex shadow-sm border">
                <Button
                  variant={roleFilter === "all" ? "white" : "transparent"}
                  size="sm"
                  className={`rounded-2 px-3 border-0 ${roleFilter === "all" ? "shadow-sm fw-bold" : "text-muted"}`}
                  onClick={() => {
                    setRoleFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  Tous
                </Button>
                <Button
                  variant={roleFilter === "admin" ? "white" : "transparent"}
                  size="sm"
                  className={`rounded-2 px-3 border-0 ${roleFilter === "admin" ? "shadow-sm fw-bold" : "text-muted"}`}
                  onClick={() => {
                    setRoleFilter("admin");
                    setCurrentPage(1);
                  }}
                >
                  Administrateur
                </Button>
                <Button
                  variant={roleFilter === "staff" ? "white" : "transparent"}
                  size="sm"
                  className={`rounded-2 px-3 border-0 ${roleFilter === "staff" ? "shadow-sm fw-bold" : "text-muted"}`}
                  onClick={() => {
                    setRoleFilter("staff");
                    setCurrentPage(1);
                  }}
                >
                  Employé
                </Button>
              </div>
              <div
                className="vr d-none d-md-block"
                style={{ height: "20px", opacity: 0.1 }}
              ></div>
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="text-decoration-none text-dark p-0 d-flex align-items-center fw-medium"
                >
                  <div
                    className="bg-light rounded-circle p-2 me-2 d-flex align-items-center justify-content-center border"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <i
                      className="ph ph-sliders-horizontal"
                      style={{ fontSize: "1.1rem" }}
                    />
                  </div>
                  <span className="small">{sortLabels[sortType]}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="shadow border-0 py-2"
                  style={{ borderRadius: "12px" }}
                >
                  <Dropdown.Header className="text-uppercase small fw-bold text-muted">
                    Nom
                  </Dropdown.Header>
                  <Dropdown.Item
                    onClick={() => {
                      setSortType("name-asc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-text-aa me-2" /> Nom (A-Z)
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortType("name-desc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-text-aa me-2" /> Nom (Z-A)
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header className="text-uppercase small fw-bold text-muted">
                    Date d'arrivée
                  </Dropdown.Header>
                  <Dropdown.Item
                    onClick={() => {
                      setSortType("date-desc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-calendar-plus me-2 text-primary" /> Plus
                    récent
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortType("date-asc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-calendar-minus me-2" /> Plus ancien
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        }
      >
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th width="60"></th>
              <th className="text-center">Nom</th>
              <th className="text-center">Rôle</th>
              <th className="text-center">Statut</th>
              <th className="text-center">Date de création</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              currentEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/tables/details-employe/${emp.id}`)}
                  style={{
                    cursor: "pointer",
                    opacity: emp.is_active ? 1 : 0.6,
                    textAlign: "center",
                  }}
                >
                  <td>
                    <AvatarPro name={`${emp.first_name} ${emp.last_name}`} />
                  </td>
                  <td>
                    <span className="h6">
                      {emp.first_name} {emp.last_name}
                    </span>
                    <div className="small text-muted">{emp.username}</div>
                  </td>
                  <td>
                    {emp.is_superuser ? (
                      <Badge
                        bg="light-danger"
                        className="text-danger border border-danger"
                      >
                        Administrateur
                      </Badge>
                    ) : (
                      <Badge
                        bg="light-primary"
                        className="text-primary border border-primary"
                      >
                        Employé
                      </Badge>
                    )}
                  </td>
                  <td>
                    {emp.is_active ? (
                      <Badge bg="success" pill>
                        Actif
                      </Badge>
                    ) : (
                      <Badge bg="secondary" pill>
                        Inactif
                      </Badge>
                    )}
                  </td>
                  <td>{new Date(emp.date_joined).toLocaleDateString()}</td>
                </tr>
              ))}
            {!loading && processedEmployees.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Aucun employé trouvé
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {processedEmployees.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top">
            <div className="text-muted small">
              {processedEmployees.length} employé(s) trouvé(s)
            </div>
            <Pagination className="mb-0">
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </MainCard>
    </>
  );
}
