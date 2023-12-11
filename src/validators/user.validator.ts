import { body } from "express-validator";

export const updateUser = [
  body("username")
  .optional()
  .isString()
  .withMessage('Le nom doit être une chaîne de caractères.')
  .isLength({min: 3})
  .withMessage('Le nom doit contenir au moins 3 caractères.')
  .isLength({max: 20})
  .withMessage('Le nom doit contenir au maximum 20 caractères.')
  .not()
  .matches(/^$|\s/)
  .withMessage('Le nom ne doit pas contenir d\'espace.'),
  body("email")
  .optional()
  .isEmail()
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  })
  .withMessage('Adresse email invalide.'),
  body("profile.avatar")
  .optional()
  .isString().withMessage("avatar must be a string"),
  body("profile.description")
  .optional()
  .isString().withMessage("description must be a string"),
  body("profile.birthday")
  .optional()
  .isDate().withMessage("birthday must be a date"),
  body("profile.location")
  .optional()
  .isString().withMessage("location must be a string"),
];