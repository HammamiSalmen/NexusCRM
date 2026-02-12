/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Badge, Spinner, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import api from "api/api";
import MainCard from "components/MainCard";
import toast from "react-hot-toast";
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

const Profile = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingMDP, setIsSubmittingMDP] = useState(false);
  const [userData, setUserData] = useState(null);
  const infoForm = useForm();
  const securityForm = useForm();
  const newPassword = securityForm.watch("password");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/me/");
      setUserData(res.data);
      infoForm.setValue("username", res.data.username);
      infoForm.setValue("first_name", res.data.first_name);
      infoForm.setValue("last_name", res.data.last_name);
      infoForm.setValue("email", res.data.email);
      infoForm.setValue("phone", res.data.phone || "");
      setLoading(false);
    } catch (error) {
      toast.error(
        t("profile_error_load", "Erreur lors du chargement du profil"),
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmitInfo = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      };
      const res = await api.patch("/api/users/me/", payload);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUserData(res.data);
      toast.success(t("profile_update_success", "Informations mises à jour !"));
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          t("profile_update_error", "Erreur lors de la mise à jour"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsSubmittingMDP(true);
    try {
      const payload = {
        current_password: data.current_password,
        new_password: data.password,
      };
      await api.post("/api/users/change-password/", payload);
      toast.success(
        t("profile_password_success", "Mot de passe modifié avec succès !"),
      );
      securityForm.reset();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          t("profile_password_invalid", "L'ancien mot de passe est incorrect"),
      );
    } finally {
      setIsSubmittingMDP(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  const fullName =
    `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
    userData.username ||
    t("profile_user", "Utilisateur");

  const UserAvatar = ({ size = "35px", fontSize = "12px" }) => (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: getAvatarColor(fullName),
        fontSize: fontSize,
      }}
    >
      {getInitials(fullName)}
    </div>
  );

  return (
    <>
      <Row>
        <Col md={4}>
          <MainCard>
            <Stack
              direction="horizontal"
              gap={3}
              className="mb-4 align-items-center"
            >
              <UserAvatar size="65px" fontSize="24px" />
              <div>
                <h4 className="mb-0">{fullName}</h4>
                <p className="text-muted mb-1 small">@{userData.username}</p>
                <Badge
                  bg={userData.is_superuser ? "light-danger" : "light-primary"}
                >
                  {userData.is_superuser
                    ? t("profile_admin", "Administrateur")
                    : t("profile_employee", "Employé")}
                </Badge>
              </div>
            </Stack>
            <hr />
            <div className="d-flex align-items-center justify-content-between py-2">
              <span className="text-muted">
                <i className="ph ph-envelope me-2" />
                {t("profile_email", "Email")}
              </span>
              <span className="fw-medium small text-truncate ms-2">
                {userData.email}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between py-2">
              <span className="text-muted">
                <i className="ph ph-calendar me-2" />
                {t("profile_member_since", "Membre depuis")}
              </span>
              <span className="fw-medium small">
                {new Date(userData.date_joined).toLocaleDateString()}
              </span>
            </div>
          </MainCard>
        </Col>

        <Col md={8}>
          <MainCard
            title={
              <Stack direction="horizontal" gap={2}>
                <i className="ph ph-user" />
                <span>
                  {t("profile_personal_info", "Informations personnelles")}
                </span>
              </Stack>
            }
          >
            <div className="d-flex align-items-start gap-4">
              <div className="flex-grow-1">
                <Form onSubmit={infoForm.handleSubmit(onSubmitInfo)}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("profile_username", "Nom d'utilisateur")}
                        </Form.Label>
                        <Form.Control
                          {...infoForm.register("username")}
                          readOnly
                          className="bg-light"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("profile_email_address", "Adresse e-mail")}
                        </Form.Label>
                        <Form.Control
                          {...infoForm.register("email", emailSchema(t))}
                          isInvalid={!!infoForm.formState.errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {infoForm.formState.errors.email?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("profile_firstname", "Prénom")}
                        </Form.Label>
                        <Form.Control
                          {...infoForm.register(
                            "first_name",
                            firstNameSchema(t),
                          )}
                          isInvalid={!!infoForm.formState.errors.first_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {infoForm.formState.errors.first_name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("profile_lastname", "Nom")}</Form.Label>
                        <Form.Control
                          {...infoForm.register("last_name", lastNameSchema(t))}
                          isInvalid={!!infoForm.formState.errors.last_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {infoForm.formState.errors.last_name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: "#7288fa", border: "none" }}
                  >
                    {isSubmitting
                      ? t("profile_saving", "Enregistrement...")
                      : t("profile_save", "Sauvegarder")}
                  </Button>
                </Form>
              </div>
            </div>
          </MainCard>

          <MainCard
            className="mt-4"
            title={
              <Stack direction="horizontal" gap={2}>
                <i className="ph ph-lock-key" />
                <span>{t("profile_security", "Sécurité du compte")}</span>
              </Stack>
            }
          >
            <div className="d-flex align-items-start gap-4">
              <div className="flex-grow-1">
                <Form onSubmit={securityForm.handleSubmit(onSubmitPassword)}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {t("profile_current_password", "Mot de passe actuel")}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder={t(
                        "profile_current_password_placeholder",
                        "Saisissez votre mot de passe actuel",
                      )}
                      {...securityForm.register("current_password", {
                        required: t(
                          "profile_required_field",
                          "Ce champ est obligatoire",
                        ),
                      })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {securityForm.formState.errors.current_password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("profile_new_password", "Nouveau mot de passe")}
                        </Form.Label>
                        <Form.Control
                          type="password"
                          {...securityForm.register(
                            "password",
                            passwordSchema(t),
                          )}
                          isInvalid={!!securityForm.formState.errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {securityForm.formState.errors.password?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t(
                            "profile_confirm_password",
                            "Confirmation du mot de passe",
                          )}
                        </Form.Label>
                        <Form.Control
                          type="password"
                          {...securityForm.register("confirmPassword", {
                            validate: (v) =>
                              v === newPassword ||
                              t(
                                "profile_password_mismatch",
                                "Les mots de passe diffèrent",
                              ),
                          })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {
                            securityForm.formState.errors.confirmPassword
                              ?.message
                          }
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2">
                    <Button
                      variant="danger"
                      type="submit"
                      disabled={isSubmittingMDP}
                      style={{ backgroundColor: "#d55858", border: "none" }}
                    >
                      {isSubmittingMDP
                        ? t("profile_changing_password", "Changement...")
                        : t(
                            "profile_change_password",
                            "Changer le mot de passe",
                          )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => securityForm.reset()}
                    >
                      {t("profile_reset", "Réinitialiser")}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </MainCard>
        </Col>
      </Row>
    </>
  );
};

export default Profile;
