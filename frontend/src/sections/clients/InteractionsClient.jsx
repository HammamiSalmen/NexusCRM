/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import api from "api/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const InteractionsClient = ({
  show,
  onHide,
  clientId,
  clientName,
  allContacts,
  initialContactId,
}) => {
  const { t, i18n } = useTranslation();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/interactions/`, {
        params: { client_id: clientId },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      const sortedData = data.sort(
        (a, b) => new Date(b.dateInteraction) - new Date(a.dateInteraction),
      );
      setInteractions(sortedData);
    } catch (error) {
      toast.error(t("error_interaction_load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchInteractions();
      setEditingId(null);
      const principalContact = allContacts.find((c) => c.isPrincipal);
      const defaultContactId = initialContactId || principalContact?.id || "";
      reset({
        dateInteraction: new Date().toISOString().slice(0, 16),
        typeInteraction: "APPEL",
        commInteraction: "",
        selectedContactId: String(defaultContactId),
      });
    }
  }, [show, clientId, initialContactId]);

  const onSubmit = async (data) => {
    try {
      let finalComment = data.commInteraction;
      finalComment = finalComment.replace(/^\[CONTACT:.*?\]\s*/, "");
      if (data.selectedContactId) {
        const c = allContacts.find(
          (contact) => String(contact.id) === String(data.selectedContactId),
        );
        if (c)
          finalComment = `[CONTACT:${c.prenomContact} ${c.nomContact}] ${finalComment}`;
      }
      const payload = {
        client: clientId,
        dateInteraction: data.dateInteraction,
        typeInteraction: data.typeInteraction,
        commInteraction: finalComment,
      };
      if (editingId) {
        await api.put(`/api/interactions/${editingId}/`, payload);
        toast.success(t("success_interaction_edit"));
      } else {
        await api.post(`/api/interactions/`, payload);
        toast.success(t("success_interaction_add"));
      }
      setEditingId(null);
      const principalContact = allContacts.find((c) => c.isPrincipal);
      const defaultContactId = initialContactId || principalContact?.id || "";
      reset({
        dateInteraction: new Date().toISOString().slice(0, 16),
        typeInteraction: "APPEL",
        commInteraction: "",
        selectedContactId: String(defaultContactId),
      });
      fetchInteractions();
    } catch (error) {
      toast.error(t("error_interaction_save"));
    }
  };

  const handleEdit = (item) => {
    const realId = item.id || item.idInteraction;
    setEditingId(realId);
    const match = item.commInteraction.match(/^\[CONTACT:(.*?)\]\s*(.*)$/);
    const cleanComment = match ? match[2] : item.commInteraction;
    setValue(
      "dateInteraction",
      new Date(item.dateInteraction).toISOString().slice(0, 16),
    );
    setValue("typeInteraction", item.typeInteraction);
    setValue("commInteraction", cleanComment);
    if (match) {
      const contact = allContacts.find(
        (c) => `${c.prenomContact} ${c.nomContact}` === match[1],
      );
      if (contact) setValue("selectedContactId", contact.id);
    }
  };

  const handleDelete = (idInt) => {
    if (!idInt) {
      toast.error(t("error_invalid_id"));
      return;
    }

    Swal.fire({
      title: t("swal_delete_title"),
      text: t("swal_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: t("swal_confirm_btn"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/interactions/${idInt}/`);
          toast.success(t("success_interaction_delete"));
          fetchInteractions();
        } catch (e) {
          toast.error(t("error_interaction_delete"));
        }
      }
    });
  };

  const getTypeConfig = (type) => {
    const configs = {
      APPEL: { color: "primary", icon: "ti-phone-call", label: t("type_call") },
      EMAIL: { color: "info", icon: "ti-mail", label: t("type_email") },
      REUNION: { color: "success", icon: "ti-users", label: t("type_meeting") },
      AUTRE: { color: "secondary", icon: "ti-dots", label: t("type_other") },
    };
    return configs[type] || configs.AUTRE;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      enforceFocus={false}
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          {editingId
            ? t("edit_interaction")
            : t("interaction_history", { name: clientName })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="p-3 bg-light border-bottom">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-2">
              <Col md={4}>
                <Form.Control
                  type="datetime-local"
                  size="sm"
                  {...register("dateInteraction")}
                />
              </Col>
              <Col md={3}>
                <Form.Select size="sm" {...register("typeInteraction")}>
                  <option value="APPEL">{t("type_call")}</option>
                  <option value="EMAIL">{t("type_email")}</option>
                  <option value="REUNION">{t("type_meeting")}</option>
                  <option value="AUTRE">{t("type_other")}</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  size="sm"
                  {...register("selectedContactId")}
                  isInvalid={!!errors.selectedContactId}
                >
                  {allContacts.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.prenomContact} {c.nomContact}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button
                  type="submit"
                  size="sm"
                  variant={editingId ? "secondary" : "primary"}
                  className="w-100"
                >
                  {editingId ? t("btn_modify") : t("btn_add")}
                </Button>
              </Col>
              <Col md={12}>
                <Form.Control
                  as="textarea"
                  rows={2}
                  size="sm"
                  placeholder={t("placeholder_interaction_details")}
                  {...register("commInteraction")}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <div className="p-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center p-3">{t("loading_in_progress")}</div>
          ) : (
            interactions.map((item) => {
              const currentId = item.id || item.idInteraction;
              const config = getTypeConfig(item.typeInteraction);
              return (
                <div key={currentId} className="d-flex mb-3 border-bottom pb-2">
                  <div
                    className={`bg-${config.color} text-white rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: "40px", height: "40px", minWidth: "40px" }}
                  >
                    <i className={`ti ${config.icon}`} />
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <div>
                        {(() => {
                          const match = item.commInteraction.match(
                            /^\[CONTACT:(.*?)\]\s*(.*)$/,
                          );
                          return match ? (
                            <>
                              <span className="badge bg-light text-dark border me-2">
                                {match[1]}
                              </span>
                              <span className="text-dark">{match[2]}</span>
                            </>
                          ) : (
                            <span className="text-dark">
                              {item.commInteraction}
                            </span>
                          );
                        })()}
                        <br />
                        <small className="text-muted">
                          {new Date(item.dateInteraction).toLocaleString(
                            i18n.language,
                          )}
                        </small>
                      </div>
                      <div>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-muted"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="ti ti-pencil" />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => handleDelete(currentId)}
                        >
                          <i className="ti ti-trash" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InteractionsClient;
