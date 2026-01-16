import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Row,
  Col,
  Button,
  Dropdown,
  Modal,
  Form,
  Image,
  Stack,
} from "react-bootstrap";
import MainCard from "components/MainCard";
import Breadcrumbs from "components/Breadcrumbs";
import api from "api/api";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import avatar1 from "assets/images/user/avatar-1.png";
import avatar2 from "assets/images/user/avatar-2.png";
import avatar3 from "assets/images/user/avatar-3.png";
import avatar4 from "assets/images/user/avatar-4.png";
import avatar5 from "assets/images/user/avatar-5.png";
import defaultAvatar from "assets/images/user/avatar-1.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

const DetailsClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getConsistentAvatar = (clientId) => {
    if (!clientId) return defaultAvatar;
    return avatars[clientId % avatars.length];
  };

  const {
    register: registerClient,
    handleSubmit: handleSubmitClient,
    setValue: setValueClient,
    formState: { errors: errorsClient },
  } = useForm();

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    setValue: setValueContact,
    reset: resetContact,
    formState: { errors: errorsContact },
  } = useForm();

  const fetchClientData = async () => {
    try {
      const res = await api.get(`/api/clients/${id}/`);
      setClient({ ...res.data, avatar: getConsistentAvatar(res.data.id) });
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger le client");
      navigate("/tables/clients-table");
    }
  };

  useEffect(() => {
    fetchClientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openEditClientModal = () => {
    setValueClient("nomClient", client.nomClient);
    setValueClient("typeClient", client.typeClient);
    setShowClientModal(true);
  };

  const onUpdateClient = async (data) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/api/clients/${id}/`, data);
      toast.success("Client modifié avec succès");
      setShowClientModal(false);
      fetchClientData();
    } catch (error) {
      toast.error("Erreur lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = () => {
    Swal.fire({
      title: "Supprimer ce client ?",
      text: "Tous les contacts associés seront aussi supprimés.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/api/clients/${id}/`).then(() => {
          Swal.fire("Supprimé !", "Le client a été supprimé.", "success");
          navigate("/tables/clients-table");
        });
      }
    });
  };

  const openContactModal = (contact = null) => {
    setSelectedContact(contact);
    if (contact) {
      setValueContact("nomContact", contact.nomContact);
      setValueContact("prenomContact", contact.prenomContact);
      setValueContact("emailContact", contact.emailContact);
      setValueContact("telContact", contact.telContact);
      setValueContact("posteContact", contact.posteContact);
      setValueContact("adresseContact", contact.adresseContact);
    } else {
      resetContact();
    }
    setShowContactModal(true);
  };

  const onSaveContact = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, client: id };
      if (selectedContact) {
        await api.put(`/api/contacts/${selectedContact.id}/`, payload);
        toast.success("Contact mis à jour");
      } else {
        await api.post(`/api/contacts/`, payload);
        toast.success("Nouveau contact ajouté");
      }
      setShowContactModal(false);
      fetchClientData();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = (contactId) => {
    Swal.fire({
      title: "Retirer ce contact ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/api/contacts/${contactId}/`).then(() => {
          toast.success("Contact retiré.");
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
        title="Détails du client"
        links={[
          { title: "Clients", to: "/tables/clients-table" },
          { title: client.nomClient },
        ]}
      />
      <Row className="justify-content-center mb-4">
        <Col md={12}>
          <MainCard className="position-relative shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-center">
                <Image
                  src={client.avatar}
                  roundedCircle
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  className="me-4 shadow-sm"
                />
                <div>
                  <h3 className="mb-0">{client.nomClient}</h3>
                  <span className="badge bg-light-primary text-primary mt-2">
                    {client.typeClient}
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="light"
                  className="border"
                  onClick={openEditClientModal}
                >
                  <i className="ti ti-pencil text-primary" />
                </Button>
                <Button
                  variant="light"
                  className="border"
                  onClick={handleDeleteClient}
                >
                  <i className="ti ti-trash me-2 text-danger" />
                </Button>
              </div>
            </div>
            <Row>
              <Col md={12}>
                <br />
                <br />
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4>
                    Contacts associés (
                    {client.contacts ? client.contacts.length : 0})
                  </h4>
                </div>
                <Row className="g-3">
                  {client.contacts &&
                    client.contacts.map((contact) => (
                      <Col key={contact.id} xs={12} sm={6} md={4} lg={3}>
                        <MainCard className="h-100 position-relative text-center shadow-sm border">
                          <Button
                            variant="link"
                            className="position-absolute text-danger p-0"
                            style={{
                              top: "10px",
                              right: "10px",
                              lineHeight: 1,
                            }}
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <i className="ti ti-x fs-5" />
                          </Button>
                          <div className="pt-2 d-flex flex-column align-items-center">
                            <Image
                              src={defaultAvatar}
                              roundedCircle
                              width="60"
                              className="mb-3"
                            />
                            <h5
                              className="mb-1 text-truncate w-100"
                              title={`${contact.prenomContact} ${contact.nomContact}`}
                            >
                              {contact.prenomContact} {contact.nomContact}
                            </h5>
                            <p className="text-muted small mb-3">
                              {contact.posteContact || "Poste inconnu"}
                            </p>
                            <div className="w-100 bg-light p-2 rounded mb-3 text-start small">
                              <div className="d-flex align-items-center mb-1 text-truncate">
                                <i className="ti ti-mail me-2 text-primary opacity-50" />
                                <span className="text-truncate">
                                  {contact.emailContact}
                                </span>
                              </div>
                              <div className="d-flex align-items-center text-truncate">
                                <i className="ti ti-phone me-2 text-primary opacity-50" />
                                <span>{contact.telContact || "-"}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="w-100 mt-auto"
                              onClick={() => openContactModal(contact)}
                            >
                              Modifier
                            </Button>
                          </div>
                        </MainCard>
                      </Col>
                    ))}
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <div
                      className="d-flex align-items-center justify-content-center border rounded h-100"
                      style={{
                        minHeight: "280px",
                        cursor: "pointer",
                        backgroundColor: "#f4fcf7",
                        borderStyle: "dashed",
                        borderWidth: "2px",
                        borderColor: "#28a745",
                      }}
                      onClick={() => openContactModal(null)}
                    >
                      <div className="text-center">
                        <i
                          className="ti ti-plus text-success"
                          style={{ fontSize: "3rem" }}
                        />
                        <h6 className="mt-2 text-success">Ajouter contact</h6>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>{" "}
          </MainCard>
        </Col>
      </Row>
      <Modal
        show={showClientModal}
        onHide={() => setShowClientModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Client</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitClient(onUpdateClient)}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom client</Form.Label>
                  <Form.Control
                    {...registerClient("nomClient", {
                      required: "Nom Client requis",
                    })}
                    isInvalid={!!errorsClient.nomClient}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsClient.nomClient?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select {...registerClient("typeClient")}>
                    <option value="PARTICULIER">Particulier</option>
                    <option value="ENTREPRISE">Entreprise</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowClientModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="info"
              type="submit"
              className="text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        show={showContactModal}
        onHide={() => setShowContactModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedContact ? "Modifier le contact" : "Nouveau contact"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitContact(onSaveContact)}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    {...registerContact("nomContact", {
                      required: "Nom requis",
                    })}
                    isInvalid={!!errorsContact.nomContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsContact.nomContact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control
                    {...registerContact("prenomContact", {
                      required: "Prénom requis",
                    })}
                    isInvalid={!!errorsContact.prenomContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsContact.prenomContact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    {...registerContact("emailContact", {
                      required: "Email requis",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Adresse email invalide",
                      },
                    })}
                    isInvalid={!!errorsContact.emailContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsContact.emailContact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control {...registerContact("telContact")} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control {...registerContact("adresseContact")} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Poste / Fonction</Form.Label>
                  <Form.Control {...registerContact("posteContact")} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowContactModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="info"
              type="submit"
              className="text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Enregistrement..."
                : selectedContact
                  ? "Mettre à jour"
                  : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default DetailsClient;
