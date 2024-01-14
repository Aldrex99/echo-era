import { body, param, query } from "express-validator";

export const addModerator = [
  param("userId")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
];

export const removeModerator = [
  param("userId")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
];

export const createGlobalChat = [
  body("name")
  .exists().withMessage("Le nom est obligatoire")
  .isString().withMessage("Le nom doit être une chaîne de caractères"),
  body("description")
  .exists().withMessage("La description est obligatoire")
  .isString().withMessage("La description doit être une chaîne de caractères"),
];

export const modifyGlobalChat = [
  body("name")
  .exists().withMessage("Le nom est obligatoire")
  .isString().withMessage("Le nom doit être une chaîne de caractères"),
  body("description")
  .exists().withMessage("La description est obligatoire")
  .isString().withMessage("La description doit être une chaîne de caractères"),
];

export const deleteGlobalChat = [
  param("chatId")
  .exists().withMessage("L'id du chat est obligatoire")
  .isMongoId().withMessage("L'id du chat n'est pas valide"),
];

export const getModerationLogs = [
  query("limit")
  .exists().withMessage("La limite de résultat est obligatoire")
  .isInt({min: 1}).withMessage("La limite de résultat doit être un nombre entier supérieur ou égal à 1"),
  query("offset")
  .exists().withMessage("Le numéro de page est obligatoire")
  .isInt({min: 0}).withMessage("Le nombre de pages doit être un nombre entier supérieur ou égal à 0"),
];