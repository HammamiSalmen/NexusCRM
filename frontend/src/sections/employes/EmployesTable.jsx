/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Table, Badge, Spinner, Button } from "react-bootstrap";
import MainCard from "components/MainCard";
import api from "api/api";
import toast from "react-hot-toast";

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
  if (!name) return "?";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const AvatarPro = ({ name, size = "35px", fontSize = "14px" }) => (
  <div
    className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
    style={{
      width: size,
      height: size,
      minWidth: size,
      backgroundColor: getAvatarColor(name),
      fontSize: fontSize,
    }}
  >
    {getInitials(name)}
  </div>
);

const handleDisableUser = (user) => {
  Swal.fire({
    title: "Désactiver l'accès ?",
    text: `L'employé ${user.first_name} ne pourra plus se connecter, mais ses données seront conservées.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Oui, désactiver",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.isConfirmed) {
      api.delete(`/api/users/${user.id}/`).then(() => {
        toast.success("Compte désactivé");
        fetchEmployees();
      });
    }
  });
};

const EmployesTable = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (currentUser?.is_superuser) {
        toast.error("Accès réservé au Superadmin");
        navigate("/dashboard");
        return;
      }
      const res = await api.get("/api/users/");
      setEmployees(res.data);
    } catch (err) {
      toast.error("Erreur lors de la récupération des employés");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Row>
        <Col md={12}>
          <MainCard title="Liste du personnel" className="border-0 shadow-sm">
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0">Employé</th>
                    <th className="border-0">Rôle</th>
                    <th className="border-0">Date d'adhésion</th>
                    <th className="border-0 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp.id}
                      style={{ opacity: emp.is_active ? 1 : 0.6 }}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <AvatarPro
                            name={`${emp.first_name} ${emp.last_name}`}
                          />
                          <div className="ms-3">
                            <h6
                              className={`mb-0 ${!emp.is_active ? "text-decoration-line-through" : ""}`}
                            >
                              {emp.first_name} {emp.last_name}
                            </h6>
                            <small className="text-muted">{emp.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {emp.is_superuser ? (
                          <Badge
                            bg="light-danger"
                            className="text-danger border border-danger"
                          >
                            <i className="ti ti-shield-check me-1" /> Superadmin
                          </Badge>
                        ) : emp.is_staff ? (
                          <Badge
                            bg="light-primary"
                            className="text-primary border border-primary"
                          >
                            <i className="ti ti-user-check me-1" /> Staff /
                            Employé
                          </Badge>
                        ) : (
                          <Badge
                            bg="light-secondary"
                            className="text-secondary"
                          >
                            Utilisateur
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="small text-muted">
                          <i className="ti ti-calendar me-1" />
                          {new Date(emp.date_joined).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        {emp.is_active ? (
                          <Badge bg="light-success" className="text-success">
                            Actif
                          </Badge>
                        ) : (
                          <Badge bg="light-danger" className="text-danger">
                            Désactivé
                          </Badge>
                        )}
                      </td>
                      <td className="text-end">
                        {emp.is_active && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDisableUser(emp)}
                          >
                            <i className="ti ti-user-off me-1" /> Désactiver
                          </Button>
                        )}
                        {!emp.is_active && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleEnableUser(emp)}
                          >
                            Réactiver
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        Aucun employé trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </MainCard>
        </Col>
      </Row>
    </>
  );
};

export default EmployesTable;
