import { body, param, query } from "express-validator";

export const sendMessage = [
  param('chatId')
  .exists().withMessage("Le chat est requis")
  .isMongoId().withMessage("Le chat est invalide"),
  body('content')
  .exists().withMessage("Le contenu est requis")
  .isString().withMessage("Le contenu est invalide")
];

export const editMessage = [
  param('messageId')
  .exists().withMessage("Le message à modifier est requis")
  .isMongoId().withMessage("Le message à modifier est invalide"),
  body('content')
  .exists().withMessage("Le contenu modifier est requis")
  .isString().withMessage("Le contenu modifier est invalide")
];

export const deleteMessage = [
  param('messageId')
  .exists().withMessage("Le message est requis")
  .isMongoId().withMessage("Le message est invalide")
];

export const getChatMessages = [
  param('chatId')
  .exists().withMessage("Le chat est requis")
  .isMongoId().withMessage("Le chat est invalide"),
  query("limit")
  .optional()
  .isInt({min: 1})
  .withMessage("Le nombre de chats à récupérer est invalide"),
  query("offset")
  .optional()
  .isInt({min: 0})
  .withMessage("Le nombre de page est invalide"),
];

export const searchMessages = [
  param('chatId')
  .exists().withMessage("Le chat est requis")
  .isMongoId().withMessage("Le chat est invalide"),
  query('search')
  .exists().withMessage("La recherche est requise")
  .isString().withMessage("La recherche est invalide"),
  query("limit")
  .optional()
  .isInt({min: 1})
  .withMessage("Le nombre de chats à récupérer est invalide"),
  query("offset")
  .optional()
  .isInt({min: 0})
  .withMessage("Le nombre de page est invalide"),
];

export const reportMessage = [
  param('messageId')
  .exists().withMessage("Le message est requis")
  .isMongoId().withMessage("Le message est invalide"),
  body('reason')
  .exists().withMessage("La raison est requise")
  .isString().withMessage("La raison est invalide")
];