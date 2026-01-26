import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Stack,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "api/api";
import toast from "react-hot-toast";
import MainCard from "components/MainCard";

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("name-asc");
  const [filterMode, setFilterMode] = useState("all");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchClients = async () => {
    try {
      const response = await api.get("/api/clients/");
      setClients(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const getProcessedClients = () => {
    let filtered = [...clients];
    if (user.is_superuser && filterMode === "mine") {
      filtered = filtered.filter((c) => c.user === user.id);
    }
    filtered.sort((a, b) => {
      switch (sortType) {
        case "name-asc":
          return a.nomClient.localeCompare(b.nomClient);
        case "name-desc":
          return b.nomClient.localeCompare(a.nomClient);
        case "date-asc":
          return (
            new Date(a.dateCreationClient) - new Date(b.dateCreationClient)
          );
        case "date-desc":
          return (
            new Date(b.dateCreationClient) - new Date(a.dateCreationClient)
          );
        default:
          return 0;
      }
    });

    return filtered;
  };

  const processedClients = getProcessedClients();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = processedClients.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(processedClients.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const sortLabels = {
    "date-desc": "Les plus récents",
    "date-asc": "Les plus anciens",
    "name-asc": "Nom (A-Z)",
    "name-desc": "Nom (Z-A)",
  };

  const getAvatarColor = (name) => {
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

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.trim().split(" ");
    return names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const InitialsAvatar = ({ name }) => (
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

  return (
    <>
      <Stack direction="horizontal" justifyContent="between" className="mb-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/tables/creer-client")}
        >
          <i className="ph ph-plus-circle me-1" /> Ajouter un nouveau client
        </Button>
      </Stack>
      <MainCard
        title={
          <Row className="align-items-center g-3">
            <Col md={4}></Col>
            <Col
              md={8}
              className="d-flex justify-content-md-end align-items-center gap-3"
            >
              {user.is_superuser && (
                <div className="bg-light p-1 rounded-3 d-flex shadow-sm border">
                  <Button
                    variant={filterMode === "all" ? "white" : "transparent"}
                    size="sm"
                    className={`rounded-2 px-3 border-0 ${filterMode === "all" ? "shadow-sm fw-bold" : "text-muted"}`}
                    onClick={() => {
                      setFilterMode("all");
                      setCurrentPage(1);
                    }}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={filterMode === "mine" ? "white" : "transparent"}
                    size="sm"
                    className={`rounded-2 px-3 border-0 ${filterMode === "mine" ? "shadow-sm fw-bold" : "text-muted"}`}
                    onClick={() => {
                      setFilterMode("mine");
                      setCurrentPage(1);
                    }}
                  >
                    Mes clients
                  </Button>
                </div>
              )}
              <div
                className="vr d-none d-md-block"
                style={{ height: "20px", opacity: 0.1 }}
              ></div>
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-sort"
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
                    Trier par nom
                  </Dropdown.Header>
                  <Dropdown.Item
                    className="py-2"
                    onClick={() => {
                      setSortType("name-asc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-sort-ascending me-2" /> Nom (A-Z)
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="py-2"
                    onClick={() => {
                      setSortType("name-desc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-sort-descending me-2" /> Nom (Z-A)
                  </Dropdown.Item>
                  <Dropdown.Divider className="opacity-50" />
                  <Dropdown.Header className="text-uppercase small fw-bold text-muted">
                    Date d'arrivée
                  </Dropdown.Header>
                  <Dropdown.Item
                    className="py-2"
                    onClick={() => {
                      setSortType("date-desc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-calendar-plus me-2 text-primary" /> Plus
                    récents
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="py-2"
                    onClick={() => {
                      setSortType("date-asc");
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-calendar-minus me-2" /> Plus anciens
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
              <th className="text-center">Type</th>
              <th className="text-center">Date de création</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              currentClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() =>
                    navigate(`/tables/details-client/${client.id}`)
                  }
                  className="table-clickable-row text-center"
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <InitialsAvatar name={client.nomClient} />
                  </td>
                  <td>
                    <span className="h6">{client.nomClient}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${client.typeClient === "ENTREPRISE" ? "bg-light-primary text-primary" : "bg-light-success text-success"}`}
                    >
                      {client.typeClient}
                    </span>
                  </td>
                  <td>
                    {new Date(client.dateCreationClient).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            {!loading && processedClients.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Aucun client n'a été trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {processedClients.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top">
            <div className="text-muted small">
              Affichage de {indexOfFirstItem + 1} à{" "}
              {Math.min(indexOfLastItem, processedClients.length)} sur{" "}
              {processedClients.length} clients
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
