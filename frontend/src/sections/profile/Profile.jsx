/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Badge, Spinner, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "api/api";
import MainCard from "components/MainCard";
import Breadcrumbs from "components/Breadcrumbs";
import toast from "react-hot-toast";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  phoneSchema,
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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch("password");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/me/");
      setUserData(res.data);
      setValue("username", res.data.username);
      setValue("first_name", res.data.first_name);
      setValue("last_name", res.data.last_name);
      setValue("email", res.data.email);
      setValue("phone", res.data.phone || "");
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement du profil");
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
        phone: data.phone,
      };
      const res = await api.patch("/api/users/me/", payload);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUserData(res.data);
      toast.success("Informations mises à jour !");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Erreur lors de la mise à jour",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        current_password: data.current_password,
        new_password: data.password,
      };
      await api.post("/api/users/change-password/", payload);
      toast.success("Mot de passe changé avec succès !");
      reset({ current_password: "", password: "", confirmPassword: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "L'ancien mot de passe est incorrect",
      );
    } finally {
      setIsSubmitting(false);
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
    "Utilisateur";

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
      <Breadcrumbs
        title="Mon Profil"
        links={[{ title: "Accueil", to: "/" }, { title: "Profil" }]}
      />
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
                  className={
                    userData.is_superuser ? "text-danger" : "text-primary"
                  }
                >
                  {userData.is_superuser ? "Admin" : "Collaborateur"}
                </Badge>
              </div>
            </Stack>
            <hr />
            <div className="d-flex align-items-center justify-content-between py-2">
              <span className="text-muted">
                <i className="ph ph-envelope me-2" /> Email
              </span>
              <span className="fw-medium small text-truncate ms-2">
                {userData.email}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between py-2">
              <span className="text-muted">
                <i className="ph ph-phone me-2" /> Téléphone
              </span>
              <span className="fw-medium small">{userData.phone || "---"}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between py-2">
              <span className="text-muted">
                <i className="ph ph-calendar me-2" /> Membre depuis
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
                <span>Informations personnelles</span>
              </Stack>
            }
          >
            <div className="d-flex align-items-start gap-4">
              <div className="flex-grow-1">
                <Form onSubmit={handleSubmit(onSubmitInfo)}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          {...register("username")}
                          readOnly
                          className="bg-light"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          {...register("email", emailSchema)}
                          isInvalid={!!errors.email}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          {...register("first_name", firstNameSchema)}
                          isInvalid={!!errors.first_name}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          {...register("last_name", lastNameSchema)}
                          isInvalid={!!errors.last_name}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          {...register("phone", phoneSchema)}
                          isInvalid={!!errors.phone}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: "#7288fa", border: "none" }}
                  >
                    {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
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
                <span>Sécurité du compte</span>
              </Stack>
            }
          >
            <div className="d-flex align-items-start gap-4">
              <div className="flex-grow-1">
                <Form onSubmit={handleSubmit(onSubmitPassword)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mot de passe actuel</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Entrez votre mot de passe actuel"
                      {...register("current_password", {
                        required: "Ce champ est obligatoire",
                      })}
                      isInvalid={!!errors.current_password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.current_password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                          type="password"
                          {...register("password", passwordSchema)}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmer</Form.Label>
                        <Form.Control
                          type="password"
                          {...register("confirmPassword", {
                            validate: (v) =>
                              v === newPassword ||
                              "Les mots de passe diffèrent",
                          })}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2">
                    <Button
                      variant="danger"
                      type="submit"
                      style={{ backgroundColor: "#d55858", border: "none" }}
                    >
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline-secondary" onClick={() => reset()}>
                      Vider
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
