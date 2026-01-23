import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Image, InputGroup, Stack, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import MainCard from "components/MainCard";
import DarkLogo from "assets/images/logo-transparent.png";
import toast from "react-hot-toast";

export default function AuthLoginForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/api/token/", {
        username: data.username,
        password: data.password,
      });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(`Bienvenue, ${user.username} !`);
      navigate("/");
    } catch (error) {
      toast.error("Identifiants invalides ou erreur serveur.");
      console.error("Login error", error);
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
            marginLeft: "1px",
            height: "90px",
          }}
        />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="text-center f-w-500 mt-4 mb-3">Connexion</h4>

        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Nom d'utilisateur"
            {...register("username", { required: "Nom d'utilisateur requis" })}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              {...register("password", { required: "Mot de passe requis" })}
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

        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4" variant="primary">
            Se connecter
          </Button>
        </div>
        <Stack
          direction="horizontal"
          className="justify-content-between align-items-end mt-4"
        >
          <h6 className={`f-w-500 mb-0 ${className}`}>
            Vous n'avez pas de compte ?
          </h6>
          <Link to={link} className="link-primary">
            S'inscrire
          </Link>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthLoginForm.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string,
};
