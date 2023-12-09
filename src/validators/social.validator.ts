import { body } from "express-validator";

export const userIdValidation = [
  body("id").isMongoId().withMessage("L'id de l'utilisateur est incorrect"),
];

export const requestIdValidation = [
  body("id").isMongoId().withMessage("L'id de la requête est incorrect"),
];

export const reportUser = [
  body("id").isMongoId().withMessage("L'id de l'utilisateur est incorrect"),
  body("message").optional().isMongoId().withMessage("L'id du message est incorrect"),
  body("reason").isString().withMessage("Le format de la raison est incorrecte"),
];