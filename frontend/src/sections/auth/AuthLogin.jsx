import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Image, InputGroup, Stack, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import MainCard from "components/MainCard";
import DarkLogo from "assets/images/logo-transparent-noir.png";
import toast from "react-hot-toast";

export default function AuthLoginForm({ className, link }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [step, setStep] = useState(1); // 1 = Credentials, 2 = OTP
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    if (step === 1) {
      try {
        await api.post("/api/auth/login-step1/", {
          username: data.username,
          password: data.password,
        });

        toast.success(
          t("auth_code_sent", "Code envoyé ! Vérifiez votre email."),
        );
        setStep(2);
      } catch (error) {
        const msg =
          error.response?.data?.detail || t("auth_login_error", "Erreur.");
        setServerError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await api.post("/api/auth/login-step2/", {
          username: data.username,
          otp: data.otp,
        });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        const user = res.data.user;
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success(
          t("auth_login_welcome", "Bienvenue") + `, ${user.username} !`,
        );
        navigate("/");
      } catch (error) {
        const msg =
          error.response?.data?.detail || t("auth_login_error", "Erreur.");
        setServerError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="text-center b-brand text-primary d-flex justify-content-center align-items-center w-100">
        <Image
          src={DarkLogo}
          alt="NexusCRM"
          style={{
            maxHeight: "100%",
            height: "100px",
            width: "160px",
          }}
        />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="text-center f-w-500 mt-4 mb-3">
          {step === 1 ? t("auth_login_title", "Connexion") : "Vérification OTP"}
        </h4>
        {serverError && <Alert variant="danger">{serverError}</Alert>}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder={t("auth_username_placeholder", "Nom d'utilisateur")}
            readOnly={step === 2}
            className={step === 2 ? "bg-light" : ""}
            {...register("username", {
              required: t(
                "error_username_required",
                "Le nom d'utilisateur est requis",
              ),
            })}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username?.message}
          </Form.Control.Feedback>
        </Form.Group>
        {step === 1 && (
          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder={t("auth_password_placeholder", "Mot de passe")}
                {...register("password", {
                  required: t(
                    "error_password_req",
                    "Le mot de passe est requis",
                  ),
                })}
                isInvalid={!!errors.password}
              />
              <Button onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? "ti ti-eye" : "ti ti-eye-off"} />
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        )}
        {step === 2 && (
          <Form.Group className="mb-3 animate__animated animate__fadeIn">
            <Form.Label>
              {t("auth_otp_label", "Code de vérification")}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={t(
                "auth_otp_placeholder",
                "Entrez le code à 6 chiffres",
              )}
              maxLength={6}
              style={{
                letterSpacing: "1px",
              }}
              {...register("otp", {
                required: t("error_otp_required", "Le code est requis"),
              })}
              isInvalid={!!errors.otp}
            />
            <Form.Control.Feedback type="invalid">
              {errors.otp?.message}
            </Form.Control.Feedback>
          </Form.Group>
        )}
        <div className="text-center mt-4">
          <Button
            type="submit"
            className="shadow px-sm-4"
            variant="primary"
            disabled={loading}
          >
            {loading
              ? "Chargement..."
              : step === 1
                ? t("auth_login_btn", "Se connecter")
                : t("auth_verify_btn", "Vérifier le code")}
          </Button>
        </div>
        <Stack
          direction="horizontal"
          className="justify-content-between align-items-end mt-4"
        >
          {step === 1 ? (
            <>
              <h6 className={`f-w-500 mb-0 ${className}`}>
                {t("auth_no_account", "Vous n'avez pas de compte ?")}
              </h6>
              <Link to={link} className="link-primary">
                {t("auth_register_link", "S'inscrire")}
              </Link>
            </>
          ) : (
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => setStep(1)}
            >
              <i className="ti ti-arrow-left me-1"></i>
              {t("auth_otp_link", "Retour")}
            </Button>
          )}
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthLoginForm.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string,
};
