import { useState } from "react";
import { Row, Col, Form, Button, Modal, Stack, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import MainCard from "components/MainCard";
import api from "api/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PosteSelect from "components/PosteSelect";
import { registerPosteUsage } from "utils/postesManager";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  phoneSchema,
} from "@/utils/validationSchema";

export default function CreerClient() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm();

  const {
    register: regContact,
    handleSubmit: handleContactSubmit,
    reset: resetContact,
    setValue: setContactValue,
    watch: watchContact,
    formState: { errors: errorsContact },
  } = useForm();

  const nomClientWatch = watch("nomClient");

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
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const AvatarPro = ({ name, size = "50px", fontSize = "16px" }) => (
    <div
      className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm mx-auto mb-2"
      style={{
        width: size,
        height: size,
        backgroundColor: getAvatarColor(name),
        fontSize,
      }}
    >
      {getInitials(name)}
    </div>
  );

  const handleOpenCreate = async () => {
    if (await trigger("nomClient")) {
      setEditingIndex(null);
      resetContact();
      setShowContactModal(true);
    } else {
      toast.error("Veuillez d'abord saisir le nom du client.");
    }
  };

  const handleOpenEdit = async (index) => {
    if (await trigger("nomClient")) {
      setEditingIndex(index);
      const contact = contacts[index];
      Object.keys(contact).forEach((key) => setContactValue(key, contact[key]));
      setShowContactModal(true);
    } else {
      toast.error(
        "Veuillez saisir le nom du client avant de modifier un contact.",
      );
    }
  };

  const setAsPrincipal = (indexToSet) => {
    setContacts(
      contacts.map((c, idx) => ({ ...c, isPrincipal: idx === indexToSet })),
    );
    toast.success(
      `${contacts[indexToSet].prenomContact} est désormais le contact principal.`,
    );
  };

  const removeContact = (indexToRemove) => {
    Swal.fire({
      title: "Supprimer ce contact ?",
      text: "Cette modification sera immédiate pour ce formulaire.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setContacts(contacts.filter((_, idx) => idx !== indexToRemove));
        toast.success("Contact retiré de la liste");
      }
    });
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
    if (data.posteContact) registerPosteUsage(data.posteContact);
    const isFirstContact = contacts.length === 0;
    const currentIsPrincipal = data.isPrincipal || isFirstContact;
    newContacts = newContacts.map((c, idx) => {
      const targetIndex =
        editingIndex !== null ? editingIndex : newContacts.length - 1;

      if (idx === targetIndex) {
        return { ...c, isPrincipal: currentIsPrincipal };
      }
      return currentIsPrincipal ? { ...c, isPrincipal: false } : c;
    });
    setContacts(newContacts);
    resetContact();
    setEditingIndex(null);
    if (action === "close") {
      setShowContactModal(false);
    } else {
      toast.success("Contact ajouté, vous pouvez en saisir un autre.");
    }
  };

  const onSubmitAll = async (clientData) => {
    if (contacts.length === 0)
      return toast.error("Veuillez ajouter au moins un contact.");
    if (!contacts.some((c) => c.isPrincipal))
      return toast.error("Veuillez désigner un contact principal.");
    try {
      setIsSubmitting(true);
      const {
        data: { id: clientId },
      } = await api.post("/api/clients/", clientData);
      await Promise.all(
        contacts.map((c) =>
          api.post("/api/contacts/", { ...c, client: clientId }),
        ),
      );
      const mainContact = contacts.find((c) => c.isPrincipal);
      if (mainContact) {
        localStorage.setItem(
          `client:${clientId}:mainContactIndex`,
          contacts.indexOf(mainContact),
        );
      }
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
            <Form
              onSubmit={handleSubmit(onSubmitAll, () =>
                toast.error("Veuillez remplir les champs obligatoires."),
              )}
            >
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Nom client <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      {...register("nomClient", {
                        required: "Le nom du client est requis.",
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
                    <Form.Label>
                      Type <span className="text-danger">*</span>
                    </Form.Label>
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
                    <MainCard
                      className={`text-center shadow-none border h-100 position-relative ${c.isPrincipal ? "border-primary bg-light-primary" : ""}`}
                      style={{ transition: "all 0.3s ease" }}
                    >
                      {c.isPrincipal ? (
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
                            Principal
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
                          onClick={() => setAsPrincipal(idx)}
                        >
                          <i className="ti ti-star-filled" />
                        </Button>
                      )}
                      <Button
                        variant="link"
                        className="position-absolute p-0 text-danger"
                        style={{ top: "10px", right: "10px", zIndex: 10 }}
                        onClick={() => removeContact(idx)}
                      >
                        <i className="ti ti-x" style={{ fontSize: "1.2rem" }} />
                      </Button>
                      <div className="pt-3">
                        <AvatarPro
                          name={`${c.prenomContact} ${c.nomContact}`}
                          size="50px"
                        />
                        <h6 className="mb-1 text-truncate">
                          {c.prenomContact} {c.nomContact}
                        </h6>
                        <p className="text-muted small mb-3">
                          {c.posteContact || "Poste non défini"}
                        </p>
                        <Button
                          variant={
                            c.isPrincipal ? "primary" : "outline-primary"
                          }
                          size="sm"
                          onClick={() => handleOpenEdit(idx)}
                        >
                          <i className="ti ti-edit me-1" /> Modifier
                        </Button>
                      </div>
                    </MainCard>
                  </Col>
                ))}
                <Col xs={12} sm={6} md={4} lg={3}>
                  <div
                    className="d-flex align-items-center justify-content-center border rounded"
                    style={{
                      height: "100%",
                      minHeight: "160px",
                      cursor: nomClientWatch ? "pointer" : "not-allowed",
                      backgroundColor: nomClientWatch ? "#f4fcf7" : "#f8f9fa",
                      borderStyle: "dashed",
                      opacity: nomClientWatch ? 1 : 0.6,
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
                      <span className="spinner-border spinner-border-sm me-2" />
                      Enregistrement en cours...
                    </>
                  ) : (
                    "Enregistrer la fiche client"
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
            {editingIndex !== null
              ? "Modifier les coordonnées du contact"
              : "Ajouter un nouveau contact"}
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nom <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    {...regContact("nomContact", lastNameSchema)}
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
                    {...regContact("prenomContact", firstNameSchema)}
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
                    Adresse e-mail <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    {...regContact("emailContact", emailSchema)}
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
                    {...regContact("telContact", phoneSchema)}
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
                      required: "L'adresse est requise.",
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
                  error={errorsContact.posteContact}
                  setValue={setContactValue}
                  watch={watchContact}
                />
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="isPrincipal"
                    label="Définir en tant que contact principal"
                    {...regContact("isPrincipal")}
                    className="fw-bold text-primary"
                  />
                  {watchContact("isPrincipal") && (
                    <Form.Text className="text-info d-block animate__animated animate__fadeIn">
                      <i className="ti ti-info-circle me-1" />
                      Ce contact sera la référence principale sur la fiche de ce
                      client.
                    </Form.Text>
                  )}
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
                Ajouter
              </Button>
            )}
            <Button
              variant="info"
              className="text-white"
              onClick={handleContactSubmit((data) =>
                onSaveContact(data, "close"),
              )}
            >
              Terminer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
