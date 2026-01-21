import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Stack,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "api/api";
import toast from "react-hot-toast";
import MainCard from "components/MainCard";

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("date-desc");
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
          <i className="ph ph-plus-circle me-1" /> Créer un nouveau client
        </Button>
      </Stack>
      <MainCard
        title={
          <Row className="align-items-center g-3">
            <Col md={4}>
              <h4 className="mb-0">Liste des clients</h4>
            </Col>
            <Col md={8}>
              <Row className="justify-content-end g-2">
                {user.is_superuser && (
                  <Col md={3}>
                    <Form.Select
                      size="sm"
                      value={filterMode}
                      onChange={(e) => {
                        setFilterMode(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">Tous les clients</option>
                      <option value="mine">Mes clients uniquement</option>
                    </Form.Select>
                  </Col>
                )}
                <Col md={3}>
                  <Form.Select
                    size="sm"
                    value={sortType}
                    onChange={(e) => {
                      setSortType(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="date-desc">Plus récent au début</option>
                    <option value="date-asc">Plus ancien au début</option>
                    <option value="name-asc">Nom (A-Z)</option>
                    <option value="name-desc">Nom (Z-A)</option>
                  </Form.Select>
                </Col>
              </Row>
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
                  Aucun client trouvé
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
