import { useState } from "react";
import { Row, Col, Form, Button, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
} from "utils/validationSchema";
import InputGroup from "react-bootstrap/InputGroup";
import MainCard from "components/MainCard";
import api from "api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreerEmploye() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const roleWatch = watch("role", "staff");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        is_staff: true,
        is_superuser: data.role === "admin",
        is_active: true,
      };

      await api.post("/api/users/", payload);
      toast.success("Employé créé avec succès !");
      navigate("/tables/employes-table");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={4}>
      <MainCard title="Création d'un nouvel employé">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Prénom <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("first_name", firstNameSchema)}
                  isInvalid={!!errors.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.first_name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Nom <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("last_name", lastNameSchema)}
                  isInvalid={!!errors.last_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.last_name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Identifiant <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("username", {
                    required: "L'identifiant est requis",
                  })}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  {...register("email", emailSchema)}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Mot de passe <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    {...register("password", passwordSchema)}
                    isInvalid={!!errors.password}
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
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Rôle <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select {...register("role")}>
                  <option value="staff">Employé</option>
                  <option value="admin">Administrateur</option>
                </Form.Select>
                {roleWatch === "admin" && (
                  <Form.Text className="text-danger">
                    <i className="ti ti-alert-triangle me-1" /> Attention : ce
                    rôle accorde l'intégralité des droits d'accès.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end mt-4">
            <Button
              variant="info"
              type="submit"
              className="px-5 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement en cours..." : "Créer l'employé"}
            </Button>
          </div>
        </Form>
      </MainCard>
    </Stack>
  );
}
