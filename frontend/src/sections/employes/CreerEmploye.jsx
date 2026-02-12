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
import { useTranslation } from "react-i18next";
import api from "api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreerEmploye() {
  const { t } = useTranslation();
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
      toast.success(t("employee_created"));
      navigate("/tables/employes-table");
    } catch (error) {
      console.error(error);
      toast.error(t("error_save_general"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={4}>
      <MainCard title={t("create_employee")}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {t("label_prenom")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("first_name", firstNameSchema(t))}
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
                  {t("label_nom")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("last_name", lastNameSchema(t))}
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
                  {t("username")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  {...register("username", {
                    required: t("error_client_name_req"),
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
                  {t("label_email_address")}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  {...register("email", emailSchema(t))}
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
                  {t("label_password")} <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder={t("label_password")}
                    {...register("password", passwordSchema(t))}
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
                  {t("label_type")} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select {...register("role")}>
                  <option value="staff">{t("employees")}</option>
                  <option value="admin">{t("administrators")}</option>
                </Form.Select>
                {roleWatch === "admin" && (
                  <Form.Text className="text-danger">
                    <i className="ti ti-alert-triangle me-1" />
                    {t("admin_warning")}
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
              {isSubmitting ? t("saving_in_progress") : t("create_employee")}
            </Button>
          </div>
        </Form>
      </MainCard>
    </Stack>
  );
}
