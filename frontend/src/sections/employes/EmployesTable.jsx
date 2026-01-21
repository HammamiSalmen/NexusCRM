/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Button, Pagination, Badge } from "react-bootstrap";
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
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};

const getInitials = (name = "") => {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
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
    setCurrentPage(1);
    fetchEmployees();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(employees.length / itemsPerPage);
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

      <MainCard title={<h4 className="mb-0">Liste des employés</h4>}>
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th width="60"></th>
              <th style={{ textAlign: "center" }}>Nom</th>
              <th style={{ textAlign: "center" }}>Rôle</th>
              <th style={{ textAlign: "center" }}>Statut</th>
              <th style={{ textAlign: "center" }}>Date de création</th>
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
            {!loading && employees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Aucun employé trouvé
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {employees.length > itemsPerPage && (
          <div className="d-flex justify-content-end p-3 border-top">
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
