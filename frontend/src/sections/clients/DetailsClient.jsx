/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Row, Col, Button, Modal, Form, Pagination } from "react-bootstrap";
import MainCard from "components/MainCard";
import Breadcrumbs from "components/Breadcrumbs";
import api from "api/api";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import PosteSelect from "components/PosteSelect";
import { registerPosteUsage } from "utils/postesManager";
import InteractionsClient from "./InteractionsClient";

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

const DetailsClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInteractionsModal, setShowInteractionsModal] = useState(false);
  const [defaultContactId, setDefaultContactId] = useState("");

  const {
    register: regClient,
    handleSubmit: handleSubClient,
    setValue: setValClient,
    formState: { errors: errClient },
  } = useForm();

  const {
    register: regContact,
    handleSubmit: handleSubContact,
    setValue: setValContact,
    reset: resetContact,
    watch: watchContact,
    formState: { errors: errorsContact },
  } = useForm();

  const openInteractionsGlobal = () => {
    setDefaultContactId("");
    setShowInteractionsModal(true);
  };

  const openInteractionsForContact = (contactId) => {
    setDefaultContactId(contactId);
    setShowInteractionsModal(true);
  };

  const fetchClientData = async () => {
    try {
      const res = await api.get(`/api/clients/${id}/`);
      const contacts = res.data.contacts || [];
      const savedMainIndex = localStorage.getItem(
        `client:${id}:mainContactIndex`,
      );
      let normalizedContacts = [...contacts];
      if (savedMainIndex !== null && normalizedContacts[savedMainIndex]) {
        normalizedContacts = normalizedContacts.map((c, idx) => ({
          ...c,
          isPrincipal: idx === Number(savedMainIndex),
        }));
      } else if (
        normalizedContacts.length > 0 &&
        !normalizedContacts.some((c) => c.isPrincipal === true)
      ) {
        normalizedContacts[0] = {
          ...normalizedContacts[0],
          isPrincipal: true,
        };
      }
      setClient({
        ...res.data,
        contacts: normalizedContacts,
      });
      setLoading(false);
    } catch (err) {
      toast.error("Impossible de charger le client");
      navigate("/tables/clients-table");
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const openEditClientModal = () => {
    setValClient("nomClient", client.nomClient);
    setValClient("typeClient", client.typeClient);
    setShowClientModal(true);
  };

  const onUpdateClient = async (data) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/api/clients/${id}/`, data);
      toast.success("Informations client mises à jour");
      setShowClientModal(false);
      fetchClientData();
    } catch (error) {
      toast.error("Erreur de mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = () => {
    Swal.fire({
      title: "Supprimer le client ?",
      text: `Cela supprimera ${client.nomClient} et tous ses contacts de façon définitive.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/api/clients/${id}/`).then(() => {
          toast.success("Client supprimé");
          navigate("/tables/clients-table");
        });
      }
    });
  };

  const openContactModal = (contact = null) => {
    setSelectedContact(contact);
    if (contact) {
      Object.keys(contact).forEach((key) => setValContact(key, contact[key]));
    } else {
      resetContact();
    }
    setShowContactModal(true);
  };

  const onSaveContact = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, client: id };
      let updatedContacts = [...(client.contacts || [])];
      if (data.isPrincipal) {
        updatedContacts = updatedContacts.map((c) => ({
          ...c,
          isPrincipal: false,
        }));
      }
      if (selectedContact) {
        await api.put(`/api/contacts/${selectedContact.id}/`, payload);
        updatedContacts = updatedContacts.map((c) =>
          c.id === selectedContact.id ? { ...c, ...payload } : c,
        );
        toast.success("Contact modifié");
      } else {
        const res = await api.post(`/api/contacts/`, payload);
        if (data.isPrincipal) {
          localStorage.setItem(`client:${id}:mainContact`, res.data.id);
        }
        const newContact = {
          ...res.data,
          isPrincipal: data.isPrincipal === true,
        };
        updatedContacts.push(newContact);
        toast.success("Contact ajouté");
      }
      if (data.isPrincipal) {
        localStorage.setItem(
          `client:${id}:mainContact`,
          selectedContact?.id ?? "NEW",
        );
      }
      if (data.posteContact) {
        registerPosteUsage(data.posteContact);
      }
      if (!updatedContacts.some((c) => c.isPrincipal)) {
        updatedContacts[0].isPrincipal = true;
        toast.error("Minimum un contact principal doit être spécifié");
      }
      setClient((prev) => ({
        ...prev,
        contacts: updatedContacts,
      }));
      setShowContactModal(false);
    } catch (error) {
      toast.error("Erreur d'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = (contact) => {
    Swal.fire({
      title: "Supprimer ce contact ?",
      text: `${contact.prenomContact} ${contact.nomContact} sera retiré.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/api/contacts/${contact.id}/`).then(() => {
          toast.success("Contact supprimé");
          fetchClientData();
        });
      }
    });
  };

  if (loading || !client) return null;

  const contacts = client.contacts || [];
  const mainContact = contacts.find((c) => c.isPrincipal);
  const otherContacts = contacts.slice(1);

  const setAsPrincipal = (indexToSet) => {
    const updated = contacts.map((c, idx) => ({
      ...c,
      isPrincipal: idx === indexToSet,
    }));
    localStorage.setItem(`client:${id}:mainContactIndex`, indexToSet);
    setClient((prev) => ({
      ...prev,
      contacts: updated,
    }));
    toast.success(
      `${updated[indexToSet].prenomContact} est maintenant le contact principal`,
    );
  };

  return (
    <>
      <Breadcrumbs
        title="Fiche Client"
        links={[
          { title: "Clients", to: "/tables/clients-table" },
          { title: client.nomClient },
        ]}
      />
      <Row className="mb-4">
        <Col md={12}>
          <MainCard className="border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <AvatarPro
                  name={client.nomClient}
                  size="80px"
                  fontSize="28px"
                />
                <div className="ms-4">
                  <h2 className="mb-1 fw-bold">{client.nomClient}</h2>
                  <span
                    className={`badge ${client.typeClient === "ENTREPRISE" ? "bg-light-primary text-primary" : "bg-light-success text-success"}`}
                  >
                    {client.typeClient}
                  </span>
                  {mainContact && (
                    <div className="mt-2 text-muted small">
                      <i className="ti ti-user-star me-1 text-warning" />
                      Contact principal :{" "}
                      <strong>
                        {mainContact.prenomContact} {mainContact.nomContact}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-info" onClick={openInteractionsGlobal}>
                  <i className="ti ti-history me-1" /> Interactions
                </Button>
                <Button variant="outline-primary" onClick={openEditClientModal}>
                  <i className="ti ti-pencil" />
                </Button>
                <Button variant="outline-danger" onClick={handleDeleteClient}>
                  <i className="ti ti-trash" />
                </Button>
              </div>
            </div>
            <hr className="my-4 opacity-10" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Contacts ({contacts.length})</h4>
            </div>
            <Row className="g-3">
              {contacts.map((contact) => (
                <Col key={contact.id} xs={12} sm={6} md={4} lg={3}>
                  <MainCard
                    className={`h-100 border text-center p-3 position-relative hover-shadow transition ${
                      contact.isPrincipal
                        ? "border-primary bg-light-primary"
                        : ""
                    }`}
                  >
                    {contact.isPrincipal ? (
                      <div
                        className="position-absolute"
                        style={{
                          top: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 11,
                        }}
                      >
                        <span className="badge rounded-pill bg-primary shadow-sm px-3">
                          <i className="ti ti-star-filled me-1" /> Contact
                          principal
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="position-absolute rounded-pill"
                        style={{
                          top: "10px",
                          left: "10px",
                          fontSize: "0.7rem",
                          zIndex: 10,
                        }}
                        onClick={() =>
                          setAsPrincipal(contacts.indexOf(contact))
                        }
                      >
                        <i className="ti ti-star-filled" />
                      </Button>
                    )}
                    <div
                      className="position-absolute"
                      style={{ top: "10px", right: "10px" }}
                    >
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => handleDeleteContact(contact)}
                      >
                        <i className="ti ti-x fs-5" />
                      </Button>
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                      <AvatarPro
                        name={`${contact.prenomContact} ${contact.nomContact}`}
                        size="60px"
                        fontSize="20px"
                      />
                    </div>
                    <h6 className="mb-1">
                      {contact.prenomContact} {contact.nomContact}
                    </h6>
                    <p className="text-muted small mb-3 text-truncate">
                      {contact.posteContact || "Aucun poste"}
                    </p>
                    <div className="bg-light p-2 rounded text-start mb-3">
                      <div className="small text-truncate mb-1">
                        <i className="ti ti-mail me-2 text-primary" />
                        {contact.emailContact}
                      </div>
                      <div className="small">
                        <i className="ti ti-phone me-2 text-primary" />
                        {contact.telContact || "-"}
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-100 py-2 shadow-sm"
                        onClick={() => openInteractionsForContact(contact.id)}
                      >
                        <i className="ti ti-message-dots fs-5" />
                        <div className="small fw-bold">Interagir</div>
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-100 py-2 shadow-sm"
                        onClick={() => openContactModal(contact)}
                      >
                        <i className="ti ti-info-circle fs-5" />
                        <div className="small fw-bold">Détails</div>
                      </Button>
                    </div>
                  </MainCard>
                </Col>
              ))}
              <Col xs={12} sm={6} md={4} lg={3}>
                <div
                  className="d-flex flex-column align-items-center justify-content-center border rounded h-100 bg-light-success"
                  style={{
                    minHeight: "220px",
                    cursor: "pointer",
                    borderStyle: "dashed",
                    borderWidth: "2px",
                    borderColor: "#28a745",
                  }}
                  onClick={() => openContactModal(null)}
                >
                  <i className="ti ti-plus fs-1 text-success mb-2" />
                  <span className="fw-bold text-success text-uppercase small">
                    Nouveau Contact
                  </span>
                </div>
              </Col>
            </Row>
          </MainCard>
        </Col>
      </Row>
      <Modal
        show={showClientModal}
        onHide={() => setShowClientModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Modifier le profil client</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubClient(onUpdateClient)}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">NOM DU CLIENT</Form.Label>
              <Form.Control
                {...regClient("nomClient", { required: true })}
                isInvalid={!!errClient.nomClient}
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label className="fw-bold small">TYPE DE CLIENT</Form.Label>
              <Form.Select {...regClient("typeClient")}>
                <option value="PARTICULIER">Particulier</option>
                <option value="ENTREPRISE">Entreprise</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={() => setShowClientModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Enregistrer les modifications
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
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            {selectedContact
              ? "Éditer le contact"
              : "Nouveau contact pour " + client.nomClient}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubContact(onSaveContact)}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nom <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    {...regContact("nomContact", { required: "Nom requis" })}
                    isInvalid={!!errorsContact.nomContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsContact.nomContact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Prénom <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    {...regContact("prenomContact", {
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
                  <Form.Label>
                    Adresse E-mail <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    {...regContact("emailContact", {
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
                  <Form.Label>
                    Téléphone <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    {...regContact("telContact", {
                      required: "Téléphone requis",
                    })}
                    isInvalid={!!errorsContact.telContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsContact.telContact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Adresse <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    {...regContact("adresseContact", {
                      required: "Adresse requis",
                    })}
                    isInvalid={!!errorsContact.adresseContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsContact.adresseContact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <PosteSelect
                  register={regContact}
                  error={errorsContact?.posteContact}
                  setValue={setValContact}
                  watch={watchContact}
                />
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="isPrincipal"
                    label="Définir comme contact principal"
                    {...regContact("isPrincipal")}
                    className="fw-bold text-primary"
                  />
                  {watchContact("isPrincipal") && (
                    <Form.Text className="text-info d-block animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1" />
                      Ce contact sera mis en avant sur la fiche client.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="link" onClick={() => setShowContactModal(false)}>
              Annuler
            </Button>
            <Button
              variant="info"
              type="submit"
              className="text-white"
              disabled={isSubmitting}
            >
              {selectedContact ? "Mettre à jour" : "Ajouter au client"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <InteractionsClient
        show={showInteractionsModal}
        onHide={() => setShowInteractionsModal(false)}
        clientId={id}
        clientName={client.nomClient}
        allContacts={client.contacts || []}
        initialContactId={defaultContactId}
      />
    </>
  );
};

export default DetailsClient;
