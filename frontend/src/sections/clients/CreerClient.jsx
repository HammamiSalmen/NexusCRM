import { useState } from "react";
import { Row, Col, Form, Button, Modal, Stack, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import MainCard from "components/MainCard";
import api from "api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "assets/images/user/avatar-1.png";

export default function CreerClient() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // en train de modifier un contact

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const {
    register: regContact,
    handleSubmit: handleContactSubmit,
    reset: resetContact,
    setValue: setContactValue, // modification
    formState: { errors: errorsContact },
  } = useForm();

  const handleOpenCreate = async () => {
    // modal
    const isClientNameValid = await trigger("nomClient");

    if (isClientNameValid) {
      setEditingIndex(null);
      resetContact();
      setShowContactModal(true);
    } else {
      toast.error("Veuillez d'abord saisir le nom du client.");
    }
  };

  const handleOpenEdit = async (index) => {
    const isClientNameValid = await trigger("nomClient");

    if (isClientNameValid) {
      setEditingIndex(index);
      const contactToEdit = contacts[index];
      setContactValue("nomContact", contactToEdit.nomContact);
      setContactValue("prenomContact", contactToEdit.prenomContact);
      setContactValue("emailContact", contactToEdit.emailContact);
      setContactValue("telContact", contactToEdit.telContact);
      setContactValue("adresseContact", contactToEdit.adresseContact);
      setContactValue("posteContact", contactToEdit.posteContact);
      setShowContactModal(true);
    } else {
      toast.error(
        "Veuillez saisir le nom du client avant de modifier un contact.",
      );
    }
  };

  const removeContact = (indexToRemove) => {
    setContacts(contacts.filter((_, idx) => idx !== indexToRemove));
    toast.success("Contact retiré de la liste");
  };

  const onSaveContact = async (data, action) => {
    let newContacts = [...contacts];

    if (editingIndex !== null) {
      newContacts[editingIndex] = data;
      toast.success("Contact modifié");
    } else {
      newContacts.push(data);
      toast.success("Contact ajouté");
    }
    setContacts(newContacts);
    resetContact();
    setEditingIndex(null);

    if (action === "close") {
      setShowContactModal(false);
      await handleSubmit((clientData) =>
        onSubmitAll(clientData, newContacts),
      )();
    } else {
      toast.success("Contact ajouté, vous pouvez en saisir un autre.");
    }
  };

  const onSubmitAll = async (clientData, contactsList = null) => {
    const listToSave = contactsList || contacts;

    if (listToSave.length === 0) {
      toast.error("Veuillez ajouter au moins un contact.");
      return;
    }

    try {
      setIsSubmitting(true);
      const clientRes = await api.post("/api/clients/", clientData);
      const clientId = clientRes.data.id;
      const contactPromises = contacts.map((c) =>
        api.post("/api/contacts/", { ...c, client: clientId }),
      );
      await Promise.all(contactPromises);
      toast.success("Client et contacts enregistrés avec succès !");
      navigate("/tables/clients-table");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        style={{
          filter: showContactModal ? "blur(5px)" : "none",
          transition: "filter 0.3s ease",
          pointerEvents: showContactModal ? "none" : "auto",
        }}
      >
        <Stack gap={4}>
          <MainCard title="Création d'un client">
            <Form onSubmit={handleSubmit(onSubmitAll)}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom client</Form.Label>
                    <Form.Control
                      {...register("nomClient", {
                        required: "Nom Client requis",
                      })}
                      isInvalid={!!errors.nomClient}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nomClient?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select {...register("typeClient")}>
                      <option value="PARTICULIER">Particulier</option>
                      <option value="ENTREPRISE">Entreprise</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <h5 className="mt-4 mb-3">Contacts associés</h5>
              <Row className="g-3">
                {contacts.map((c, idx) => (
                  <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                    <MainCard className="text-center shadow-none border h-100 position-relative">
                      <Button
                        variant="link"
                        className="position-absolute p-0 text-danger"
                        style={{
                          top: "10px",
                          right: "10px",
                          zIndex: 10,
                          lineHeight: 1,
                        }}
                        onClick={() => removeContact(idx)}
                      >
                        <i
                          className="ti ti-x"
                          style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                        />
                      </Button>
                      <Image
                        src={defaultAvatar}
                        roundedCircle
                        width="50"
                        className="mb-2"
                      />
                      <h6>
                        {c.prenomContact} {c.nomContact}
                      </h6>
                      <p className="text-muted small mb-2">
                        {c.posteContact || "Aucun poste"}
                      </p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleOpenEdit(idx)}
                      >
                        Modifier
                      </Button>
                    </MainCard>
                  </Col>
                ))}
                <Col xs={12} sm={6} md={4} lg={3}>
                  <div
                    className="d-flex align-items-center justify-content-center border rounded"
                    style={{
                      height: "100%",
                      minHeight: "160px",
                      cursor: "pointer",
                      backgroundColor: "#f4fcf7",
                      borderStyle: "dashed",
                    }}
                    onClick={handleOpenCreate}
                  >
                    <i
                      className="ti ti-plus text-success"
                      style={{ fontSize: "3rem" }}
                    />
                  </div>
                </Col>
              </Row>
              <div className="text-end mt-4">
                <Button
                  variant="info"
                  type="submit"
                  className="px-5 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer le client"
                  )}
                </Button>
              </div>
            </Form>
          </MainCard>
        </Stack>
      </div>

      <Modal
        show={showContactModal}
        onHide={() => setShowContactModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingIndex !== null ? "Modifier le contact" : "Nouveau contact"}
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
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
                  <Form.Label>Prénom</Form.Label>
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
                  <Form.Label>Adresse E-mail</Form.Label>
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
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control {...regContact("telContact")} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control {...regContact("adresseContact")} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Poste / Fonction</Form.Label>
                  <Form.Control {...regContact("posteContact")} />
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
            {editingIndex === null && (
              <Button
                variant="primary"
                onClick={handleContactSubmit((data) =>
                  onSaveContact(data, "create"),
                )}
              >
                Ajouter un autre contact
              </Button>
            )}
            <Button
              variant="info"
              className="text-white"
              disabled={isSubmitting}
              onClick={handleContactSubmit((data) =>
                onSaveContact(data, "close"),
              )}
            >
              {isSubmitting ? "Envoi en cours..." : "Terminer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
