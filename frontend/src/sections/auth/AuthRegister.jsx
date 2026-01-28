import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import MainCard from "components/MainCard";
import {
  confirmPasswordSchema,
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
} from "utils/validationSchema";
import DarkLogo from "assets/images/logo-transparent-noir.png";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";

export default function AuthRegisterForm({ className, link }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: t(
          "error_passwords_mismatch_msg",
          "Les mots de passe ne correspondent pas !",
        ),
      });
      return;
    }
    clearErrors("confirmPassword");

    try {
      await api.post("/api/auth/register/", {
        username: data.username,
        password: data.password,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
      });

      toast.success(t("auth_register_success", "Compte créé avec succès !"));
      reset();

      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const msg =
          error.response.data.username ||
          t("auth_register_error", "Erreur lors de l'inscription.");
        toast.error(msg.toString());
      } else {
        toast.error(
          t("auth_server_error", "Impossible de contacter le serveur."),
        );
      }
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="b-brand text-primary d-flex justify-content-center align-items-center w-100">
        <a>
          <Image
            src={DarkLogo}
            alt="NexusCRM"
            style={{
              maxHeight: "100%",
              height: "100px",
              width: "160px",
            }}
          />
        </a>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>
          {t("auth_register_title", "Inscription")}
        </h4>
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Control
                type="text"
                placeholder={t("auth_firstname_placeholder", "Prénom")}
                {...register("firstName", firstNameSchema(t))}
                isInvalid={!!errors.firstName}
                className={
                  className &&
                  "bg-transparent border-white text-white border-opacity-25 "
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Control
                type="text"
                placeholder={t("auth_lastname_placeholder", "Nom")}
                {...register("lastName", lastNameSchema(t))}
                isInvalid={!!errors.lastName}
                className={
                  className &&
                  "bg-transparent border-white text-white border-opacity-25 "
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Control
            type="text"
            placeholder={t("auth_username_placeholder", "Nom d'utilisateur")}
            {...register("username", {
              required: t(
                "error_username_required",
                "Le nom d'utilisateur est requis",
              ),
            })}
            isInvalid={!!errors.username}
            className={
              className &&
              "bg-transparent border-white text-white border-opacity-25"
            }
          />
          <Form.Control.Feedback type="invalid">
            {errors.username?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder={t("auth_email_placeholder", "Adresse e-mail")}
            {...register("email", emailSchema(t))}
            isInvalid={!!errors.email}
            className={
              className &&
              "bg-transparent border-white text-white border-opacity-25 "
            }
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder={t("auth_password_placeholder", "Mot de passe")}
              {...register("password", passwordSchema(t))}
              isInvalid={!!errors.password}
              className={
                className &&
                "bg-transparent border-white text-white border-opacity-25 "
              }
            />
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? (
                <i className="ti ti-eye" />
              ) : (
                <i className="ti ti-eye-off" />
              )}
            </Button>
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Control
            type="password"
            placeholder={t(
              "auth_confirm_password_placeholder",
              "Confirmer le mot de passe",
            )}
            {...register("confirmPassword", confirmPasswordSchema(t))}
            isInvalid={!!errors.confirmPassword}
            className={
              className &&
              "bg-transparent border-white text-white border-opacity-25 "
            }
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Stack direction="horizontal" className="mt-1 justify-content-between">
          <Form.Group controlId="customCheckc1">
            <Form.Check
              type="checkbox"
              label={t(
                "auth_accept_terms",
                "J'accepte les conditions générales d'utilisation",
              )}
              defaultChecked
              className={`input-primary ${className ? className : "text-muted"} `}
            />
          </Form.Group>
        </Stack>
        <div className="text-center mt-4">
          <Button
            type="submit"
            className="shadow px-sm-4"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("auth_register_loading", "Création en cours...")
              : t("auth_register_btn", "S'inscrire")}
          </Button>
        </div>
        <Stack
          direction="horizontal"
          className="justify-content-between align-items-end mt-4"
        >
          <h6 className={`f-w-500 mb-0 ${className}`}>
            {t("auth_already_registered", "Déjà inscrit ?")}
          </h6>
          <Link to={link} className="link-primary">
            {t("auth_login_link", "Se connecter")}
          </Link>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthRegisterForm.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string,
};
