import { useState, useEffect } from "react";
import { Table, Button, Pagination, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "api/api";
import toast from "react-hot-toast";
import MainCard from "components/MainCard";

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

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
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const InitialsAvatar = ({ name }) => (
    <div
      className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
      style={{
        width: "35px",
        height: "35px",
        backgroundColor: getAvatarColor(name),
        fontSize: "14px",
        letterSpacing: "-1px",
      }}
    >
      {getInitials(name)}
    </div>
  );

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
    setCurrentPage(1);
    fetchClients();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className="mb-4"
        onClick={() => navigate("/tables/creer-client")}
      >
        <i className="ph ph-plus-circle me-1" /> Créer un nouveau client
      </Button>
      <MainCard title={<h4 className="mb-0">Liste des clients</h4>}>
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
            {!loading && clients.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Aucun client trouvé
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {clients.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top">
            <div className="text-muted small">
              Affichage de {indexOfFirstItem + 1} à{" "}
              {Math.min(indexOfLastItem, clients.length)} sur {clients.length}{" "}
              clients
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
