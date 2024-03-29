import { body, param, query } from "express-validator";

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

export const getUserChats = [
  query("limit")
  .optional()
  .isInt({min: 1})
  .withMessage("Le nombre de chats à récupérer est invalide"),
  query("offset")
  .optional()
  .isInt({min: 0})
  .withMessage("Le nombre de page est invalide"),
];

export const getChatInfo = [
  param("id").isMongoId().withMessage("L'id du chat est invalide"),
];

export const addUserToChat = [
  param("id").isMongoId().withMessage("L'id du chat est invalide"),
  body("userId").isMongoId().withMessage("L'id de l'utilisateur est invalide"),
];

export const acceptChatRequest = [
  param("requestId").isMongoId().withMessage("L'id de la requête est invalide"),
];

export const declineChatRequest = [
  param("requestId").isMongoId().withMessage("L'id de la requête est invalide"),
];

export const updateChatInfo = [
  param("chatId").isMongoId().withMessage("L'id du chat est invalide"),
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
  param("chatId").isMongoId().withMessage("L'id du chat est invalide"),
  param("userId").isMongoId().withMessage("L'id de l'utilisateur est invalide"),
  body("role")
  .isIn(["user", "moderator", "admin"])
  .withMessage("Le rôle est invalide"),
];

export const removeUserFromChat = [
  param("chatId").isMongoId().withMessage("L'id du chat est invalide"),
  param("userId").isMongoId().withMessage("L'id de l'utilisateur est invalide"),
];

export const leaveChat = [
  param("chatId").isMongoId().withMessage("L'id du chat est invalide"),
];

export const deleteChat = [
  param("chatId").isMongoId().withMessage("L'id du chat est invalide"),
];

export const searchChats = [
  query("search")
  .isLength({min: 1})
  .withMessage("La recherche est invalide"),
];