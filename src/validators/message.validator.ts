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
  query('limit')
  .exists().withMessage("La limite est requise")
  .isInt({min: 1}).withMessage("La limite est invalide"),
  query('offset')
  .exists().withMessage("L'offset est requis")
  .isInt({min: 1}).withMessage("L'offset est invalide")
];

export const searchMessages = [
  param('chatId')
  .exists().withMessage("Le chat est requis")
  .isMongoId().withMessage("Le chat est invalide"),
  query('search')
  .exists().withMessage("La recherche est requise")
  .isString().withMessage("La recherche est invalide"),
  query('limit')
  .exists().withMessage("La limite est requise")
  .isInt({min: 1}).withMessage("La limite est invalide"),
  query('offset')
  .exists().withMessage("L'offset est requis")
  .isInt({min: 1}).withMessage("L'offset est invalide")
];

export const reportMessage = [
  body('messageId')
  .exists().withMessage("Le message est requis")
  .isMongoId().withMessage("Le message est invalide"),
  body('reason')
  .exists().withMessage("La raison est requise")
  .isString().withMessage("La raison est invalide")
];