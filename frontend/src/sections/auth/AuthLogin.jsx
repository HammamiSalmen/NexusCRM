import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Image, InputGroup, Stack, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../../api/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import MainCard from "components/MainCard";
import DarkLogo from "assets/images/logo-dark.svg";

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
      navigate("/");
    } catch (error) {
      setServerError("Identifiants invalides ou erreur serveur.");
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="text-center">
        <Image src={DarkLogo} alt="NexusCRM" />
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="text-center f-w-500 mt-4 mb-3">Login</h4>

        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username requis" })}
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
              placeholder="Password"
              {...register("password", { required: "Mot de passe requis" })}
              isInvalid={!!errors.password}
            />
            <Button
              onClick={() => setShowPassword(!showPassword)}
              variant="outline-secondary"
            >
              <i className={showPassword ? "ti ti-eye" : "ti ti-eye-off"} />
            </Button>
          </InputGroup>
        </Form.Group>

        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4" variant="primary">
            Login
          </Button>
        </div>
      </Form>
    </MainCard>
  );
}
