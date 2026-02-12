export const emailSchema = (t) => ({
  required: t("err_email_required", "L'adresse e-mail est requise"),
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: t("err_email_invalid", "Adresse e-mail invalide"),
  },
});

export const passwordSchema = (t) => ({
  required: t("error_password_req", "Le mot de passe est requis"),
  minLength: {
    value: 8,
    message: t(
      "error_password_min_8",
      "Le mot de passe doit contenir au moins 8 caractères",
    ),
  },
});

export const confirmPasswordSchema = (t) => ({
  required: t(
    "error_confirm_password_req",
    "La confirmation du mot de passe est requise",
  ),
  minLength: {
    value: 8,
    message: t(
      "error_passwords_mismatch_msg",
      "Les deux mots de passe ne correspondent pas",
    ),
  },
});

export const firstNameSchema = (t) => ({
  required: t("error_firstname_req", "Le prénom est requis"),
  pattern: {
    value: /^[a-zA-Z\s]+$/,
    message: t("error_firstname_inv", "Prénom invalide"),
  },
});

export const lastNameSchema = (t) => ({
  required: t("error_lastname_req", "Le nom est requis"),
  pattern: {
    value: /^[a-zA-Z\s]+$/,
    message: t("error_lastname_inv", "Nom invalide"),
  },
});

export const phoneSchema = (t) => ({
  required: t("error_phone_req", "Le numéro de téléphone est requis"),
  pattern: {
    value: /^\+?[\d\s\-\(\)]{8,20}$/,
    message: t("error_phone_inv", "Numéro de téléphone invalide"),
  },
});
