import { body } from "express-validator";

export const createChat = [
  body("name")
  .isLength({min: 1})
  .withMessage("Le nom du chat est requis"),
  body("description")
  .optional()
  .isLength({min: 1})
  .withMessage("La description du chat est requise"),
  body("type")
  .isIn(["public", "group"])
  .withMessage("Le type de chat est invalide"),
  body("participants")
  .isArray({min: 2})
  .withMessage("Le chat doit avoir au moins 3 participants (vous inclus)"),
];

export const acceptChatRequest = [
  body("requestId").isMongoId().withMessage("L'id de la requête est invalide"),
];

export const declineChatRequest = [
  body("requestId").isMongoId().withMessage("L'id de la requête est invalide"),
];

export const updateChatInfo = [
  body("name")
  .optional()
  .isLength({min: 1})
  .withMessage("Le nom du chat est requis"),
  body("description")
  .optional()
  .isLength({min: 1})
  .withMessage("La description du chat est requise"),
];

export const updateChatParticipantRole = [
  body("role")
  .isIn(["user", "moderator", "admin"])
  .withMessage("Le rôle est invalide"),
  body("userId").isMongoId().withMessage("L'id de l'utilisateur est invalide"),
];

export const removeUserFromChat = [
  body("userId").isMongoId().withMessage("L'id de l'utilisateur est invalide"),
];
