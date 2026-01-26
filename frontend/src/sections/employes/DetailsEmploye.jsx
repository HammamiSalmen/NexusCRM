/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
  Pagination,
  Badge,
} from "react-bootstrap";
import MainCard from "components/MainCard";
import api from "api/api";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
} from "@/utils/validationSchema";

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

const DetailsEmploye = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employe, setEmploye] = useState(null);
  const [clientsGeres, setClientsGeres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [clientToTransfer, setClientToTransfer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchEmployeData = async () => {
    try {
      const [resUser, resClients, resAllUsers] = await Promise.all([
        api.get(`/api/users/${id}/`),
        api.get(`/api/clients/`),
        api.get(`/api/users/`),
      ]);
      setEmploye(resUser.data);
      const filteredClients = resClients.data.filter(
        (c) => c.user === parseInt(id),
      );
      setClientsGeres(filteredClients);
      setAllUsers(
        resAllUsers.data.filter((u) => u.id !== parseInt(id) && u.is_active),
      );
      setLoading(false);
    } catch (err) {
      toast.error("Erreur lors du chargement des données.");
      navigate("/tables/employes-table");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchEmployeData();
  }, [id]);

  const openEditModal = () => {
    setValue("first_name", employe.first_name);
    setValue("last_name", employe.last_name);
    setValue("email", employe.email);
    setValue("role", employe.is_superuser ? "admin" : "staff");
    setShowEditModal(true);
  };

  const onUpdateEmploye = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        is_superuser: data.role === "admin",
      };
      if (data.password) payload.password = data.password;
      await api.patch(`/api/users/${id}/`, payload);
      toast.success("Employé mis à jour avec succès.");
      setShowEditModal(false);
      fetchEmployeData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async (event) => {
    event.preventDefault();
    const newUserId = event.target.newUserId.value;
    if (!newUserId) return toast.error("Veuillez choisir un utilisateur.");
    try {
      setIsSubmitting(true);
      await api.patch(`/api/clients/${clientToTransfer.id}/`, {
        user: newUserId,
      });
      toast.success(`Le client a été transféré avec succès.`);
      setShowTransferModal(false);
      fetchEmployeData();
    } catch (error) {
      toast.error("Erreur lors du transfert.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisableUser = () => {
    Swal.fire({
      title: employe.is_active
        ? "Désactiver ce compte ?"
        : "Réactiver ce compte ?",
      text: employe.is_active
        ? "L'utilisateur ne pourra plus accéder à la plateforme."
        : "L'utilisateur pourra de nouveau accéder à la plateforme.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: employe.is_active ? "#e74c3c" : "#2ecc71",
      confirmButtonText: employe.is_active
        ? "Oui, désactiver"
        : "Oui, réactiver",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.patch(`/api/users/${id}/`, { is_active: !employe.is_active });
        toast.success(
          employe.is_active ? "Compte désactivé." : "Compte réactivé.",
        );
        fetchEmployeData();
      }
    });
  };

  if (loading || !employe) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = clientsGeres.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clientsGeres.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Row className="mb-4">
        <Col md={12}>
          <MainCard className="border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <AvatarPro
                  name={`${employe.first_name} ${employe.last_name}`}
                  size="80px"
                  fontSize="28px"
                />
                <div className="ms-4">
                  <h2 className="mb-1 fw-bold">
                    <span
                      className={
                        !employe.is_active
                          ? "text-decoration-line-through text-muted"
                          : ""
                      }
                    >
                      {employe.first_name} {employe.last_name}
                    </span>
                  </h2>
                  <div className="d-flex gap-2 mt-2">
                    {employe.is_superuser ? (
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
                    {employe.is_active ? (
                      <Badge bg="light-success" className="text-success">
                        Compte actif
                      </Badge>
                    ) : (
                      <Badge bg="light-secondary" className="text-secondary">
                        Compte désactivé
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 text-muted small">
                    <i className="ti ti-mail me-1" /> {employe.email} |{" "}
                    <i className="ti ti-user me-1" /> @{employe.username}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={openEditModal}>
                  <i className="ti ti-pencil" /> Modifier
                </Button>
                <Button
                  variant={
                    employe.is_active ? "outline-danger" : "outline-success"
                  }
                  onClick={handleDisableUser}
                >
                  <i
                    className={`ti ${employe.is_active ? "ti-user-off" : "ti-user-check"}`}
                  />
                  {employe.is_active ? " Désactiver" : " Réactiver"}
                </Button>
              </div>
            </div>
            <hr className="my-4 opacity-10" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Clients associés ({clientsGeres.length})</h4>
            </div>
            {clientsGeres.length > 0 ? (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th width="60"></th>
                      <th className="text-center">Nom</th>
                      <th className="text-center">Type</th>
                      <th className="text-center">Date de création</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClients.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() =>
                          navigate(`/tables/details-client/${client.id}`)
                        }
                        className="table-clickable-row text-center"
                        style={{ cursor: "pointer" }}
                      >
                        <td className="text-center">
                          <AvatarPro name={client.nomClient} />
                        </td>
                        <td>
                          <span className="h6">{client.nomClient}</span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge ${client.typeClient === "ENTREPRISE" ? "bg-light-primary text-primary" : "bg-light-success text-success"}`}
                          >
                            {client.typeClient}
                          </span>
                        </td>
                        <td className="text-center">
                          {new Date(
                            client.dateCreationClient,
                          ).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            title="Transférer à un autre agent"
                            onClick={(e) => {
                              e.stopPropagation();
                              setClientToTransfer(client);
                              setShowTransferModal(true);
                            }}
                          >
                            <i className="ti ti-arrows-exchange" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {clientsGeres.length > itemsPerPage && (
                  <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <div className="text-muted small">
                      Affichage de {indexOfFirstItem + 1} à{" "}
                      {Math.min(indexOfLastItem, clientsGeres.length)} sur{" "}
                      {clientsGeres.length} clients
                    </div>
                    <Pagination className="mb-0">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Pagination.Item>
                        );
                      })}

                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-5 text-muted bg-light rounded dashed-border">
                <i className="ti ti-folder-off fs-1 mb-2 d-block" />
                Cet employé ne gère aucun client pour le moment.
              </div>
            )}
          </MainCard>
        </Col>
      </Row>
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Modifier l'employé</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onUpdateEmploye)}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control {...register("first_name", firstNameSchema)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control {...register("last_name", lastNameSchema)} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email", emailSchema)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Rôle</Form.Label>
                  <Form.Select {...register("role")}>
                    <option value="staff">Employé</option>
                    <option value="admin">Administrateur</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nouveau mot de passe (laisser vide si inchangé)
                  </Form.Label>
                  <Form.Control
                    type="password"
                    {...register("password", passwordSchema)}
                    placeholder="******"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Enregistrer les modifications
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Transférer le client</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransfer}>
          <Modal.Body>
            <p>
              Transférer <strong>{clientToTransfer?.nomClient}</strong> vers un
              autre collaborateur :
            </p>
            <Form.Group>
              <Form.Label>Choisir le nouvel attributaire</Form.Label>
              <Form.Select name="newUserId" required>
                <option value="">Sélectionner un employé...</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} (@{user.username})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={() => setShowTransferModal(false)}>
              Annuler
            </Button>
            <Button variant="warning" type="submit" disabled={isSubmitting}>
              Confirmer le transfert
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default DetailsEmploye;
