export const emailSchema = {
  required: "L'adresse e-mail est requise",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Adresse e-mail invalide",
  },
};

export const passwordSchema = {
  required: "Le mot de passe est requis",
  minLength: {
    value: 8,
    message: "Le mot de passe doit contenir au moins 8 caractères",
  },
};

export const confirmPasswordSchema = {
  required: "La confirmation du mot de passe est requise",
  minLength: {
    value: 8,
    message: "Les deux mots de passe ne correspondent pas",
  },
};

export const firstNameSchema = {
  required: "Le prénom est requis",
  pattern: { value: /^[a-zA-Z\s]+$/, message: "Prénom invalide" },
};

export const lastNameSchema = {
  required: "Le nom est requis",
  pattern: { value: /^[a-zA-Z\s]+$/, message: "Nom invalide" },
};

export const phoneSchema = {
  required: "Le numéro de téléphone est requis",
  pattern: {
    value: /^\+?[\d\s\-\(\)]{8,20}$/,
    message: "Numéro de téléphone invalide",
  },
};
