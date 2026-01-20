export const emailSchema = {
  required: "Email est requis",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Email invalide",
  },
};

export const passwordSchema = {
  required: "Mot de passe est requis",
  minLength: {
    value: 8,
    message: "Mot de passe doit contenir au moins 8 caractères",
  },
};

export const confirmPasswordSchema = {
  required: "Confirmation est requis",
  minLength: { value: 8, message: "les 2 mots de passe ne correspondent pas" },
};

export const firstNameSchema = {
  required: "Prénom est requis",
  pattern: { value: /^[a-zA-Z\s]+$/, message: "Prénom invalide" },
};

export const lastNameSchema = {
  required: "Nom est requis",
  pattern: { value: /^[a-zA-Z\s]+$/, message: "Nom invalide" },
};

export const phoneSchema = {
  required: "Téléphone est requis",
  pattern: {
    value: /^\+?[\d\s\-\(\)]{8,20}$/,
    message: "Téléphone invalide",
  },
};
