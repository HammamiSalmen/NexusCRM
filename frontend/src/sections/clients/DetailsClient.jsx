/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Dropdown,
  Modal,
  Form,
  Card,
  Image,
  Stack,
} from "react-bootstrap";
import MainCard from "components/MainCard";
import Breadcrumbs from "components/Breadcrumbs";
import api from "api/api";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import defaultAvatar from "assets/images/user/avatar-1.png";

const DetailsClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchClientData = async () => {
    try {
      const res = await api.get(`/api/clients/${id}/`);
      setClient(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Erreur de chargement");
      navigate("/tables/clients-table");
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const handleDeleteClient = () => {
    Swal.fire({
      title: "Supprimer le client ?",
      text: "Cette action supprimera également tous les contacts.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/api/clients/${id}/`).then(() => {
          toast.success("Client supprimé");
          navigate("/tables/clients-table");
        });
      }
    });
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.client = id;

    try {
      if (selectedContact) {
        await api.put(`/api/contacts/${selectedContact.id}/`, data);
        toast.success("Contact mis à jour");
      } else {
        await api.post(`/api/contacts/`, data);
        toast.success("Contact ajouté");
      }
      setShowContactModal(false);
      fetchClientData();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const deleteContact = (cId) => {
    Swal.fire({
      title: "Supprimer ce contact ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/api/contacts/${cId}/`).then(() => {
          toast.success("Contact supprimé");
          fetchClientData();
        });
      }
    });
  };

  if (loading || !client) return null;

  return (
    <>
      <Toaster position="top-right" />
      <Breadcrumbs
        title="Détails d'un contact"
        links={[
          { title: "clientes", to: "/tables/clients-table" },
          { title: "consulter client" },
        ]}
      />
      <MainCard className="mb-4 shadow-none border-0">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center">
            <Image
              src={client.avatar || defaultAvatar}
              roundedCircle
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
              className="me-4 shadow-sm"
            />
            <div>
              <h3 className="mb-0 fw-bold">{client.nomClient}</h3>
              <p className="text-muted mb-3">
                {client.typeClient || "Manager"}
              </p>
              <Stack gap={2}>
                {client.email && (
                  <div className="d-flex align-items-center text-muted">
                    <i className="ti ti-mail me-2 fs-5" /> {client.email}
                  </div>
                )}
                {client.telephone && (
                  <div className="d-flex align-items-center text-muted">
                    <i className="ti ti-device-mobile me-2 fs-5" />{" "}
                    {client.telephone}
                  </div>
                )}
                {client.adresse && (
                  <div className="d-flex align-items-center text-muted">
                    <i className="ti ti-map-pin me-2 fs-5" /> {client.adresse}
                  </div>
                )}
              </Stack>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              style={{ backgroundColor: "#8e85d6", border: "none" }}
              onClick={() => setShowClientModal(true)}
            >
              <i className="ti ti-pencil" />
            </Button>
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="no-caret border-0 bg-transparent"
              >
                <i className="ti ti-dots-vertical fs-4" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={handleDeleteClient}
                  className="text-danger"
                >
                  Supprimer
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="mt-5">
          <h5 className="mb-4 fw-bold">
            Contacts ({client.contacts?.length || 0})
          </h5>
          <div className="d-flex flex-wrap gap-3">
            {client.contacts?.map((contact) => (
              <Card
                key={contact.id}
                className="border shadow-none"
                style={{ width: "220px" }}
              >
                <Card.Body className="text-center p-3">
                  <div
                    className="position-absolute"
                    style={{ top: "5px", right: "5px" }}
                  >
                    <i
                      className="ti ti-x text-muted cursor-pointer"
                      onClick={() => deleteContact(contact.id)}
                    />
                  </div>
                  <Image
                    src={defaultAvatar}
                    roundedCircle
                    width="50"
                    className="mb-2"
                  />
                  <h6 className="mb-0 text-truncate">
                    {contact.prenomContact} {contact.nomContact}
                  </h6>
                  <p className="text-muted small mb-3">
                    {contact.posteContact || "PositionX"}
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-100"
                    style={{ backgroundColor: "#a399e3", border: "none" }}
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowContactModal(true);
                    }}
                  >
                    Modifier
                  </Button>
                </Card.Body>
              </Card>
            ))}
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: "220px",
                height: "145px",
                backgroundColor: "#a5f3f3",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedContact(null);
                setShowContactModal(true);
              }}
            >
              <i className="ti ti-plus text-white display-4" />
            </div>
          </div>
        </div>
      </MainCard>
      <MainCard className="shadow-none border-0">
        <h5 className="fw-bold d-flex align-items-center">
          <i className="ti ti-history me-2 fs-4" /> Historique d'interactions
        </h5>
        <hr className="my-4 text-muted opacity-25" />
        <div className="text-center py-5 text-muted">
          <em>Aucun historique disponible pour le moment.</em>
        </div>
      </MainCard>
      <Modal
        show={showContactModal}
        onHide={() => setShowContactModal(false)}
        centered
        size="lg"
      >
        <Modal.Body className="p-4">
          <Form onSubmit={handleSaveContact}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted">
                    Nom client
                  </Form.Label>
                  <Form.Control
                    name="nomContact"
                    defaultValue={selectedContact?.nomContact}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted">
                    Prenom client
                  </Form.Label>
                  <Form.Control
                    name="prenomContact"
                    defaultValue={selectedContact?.prenomContact}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted">
                    Adresse E-mail
                  </Form.Label>
                  <Form.Control
                    name="emailContact"
                    type="email"
                    defaultValue={selectedContact?.emailContact}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted">Poste</Form.Label>
                  <Form.Select
                    name="posteContact"
                    defaultValue={selectedContact?.posteContact}
                  >
                    <option value="Manager">Manager</option>
                    <option value="Acheteur">Acheteur</option>
                    <option value="Technicien">Technicien</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted">
                    Téléphone
                  </Form.Label>
                  <Form.Control
                    name="telContact"
                    defaultValue={selectedContact?.telContact}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted">Adresse</Form.Label>
                  <Form.Control
                    name="adresseContact"
                    defaultValue={selectedContact?.adresseContact}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                style={{ backgroundColor: "#20e3c5", border: "none" }}
              >
                Enregistrer et fermer
              </Button>
              {!selectedContact && (
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#8e85d6", border: "none" }}
                >
                  Enregistrer et créer
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailsClient;
