import { body, param, query } from "express-validator";

export const getAllUsers = [
  query("limit")
  .exists().withMessage("La limite de résultat est obligatoire")
  .isInt({min: 1}).withMessage("La limite de résultat doit être un nombre entier supérieur ou égal à 1"),
  query("offset")
  .exists().withMessage("Le numéro de page est obligatoire")
  .isInt({min: 0}).withMessage("Le nombre de pages doit être un nombre entier supérieur ou égal à 0"),
  query("sort")
  .optional()
  .isString().withMessage("Le champ de tri doit être une chaîne de caractères"),
  query("direction")
  .optional()
  .isIn(['asc', 'desc']).withMessage("La direction de tri doit être 'asc' ou 'desc'"),
];

export const searchUsers = [
  query("query")
  .exists().withMessage("Le champ recherche est obligatoire")
  .isString().withMessage("Le champ recherche doit être une chaîne de caractères"),
  query("limit")
  .exists().withMessage("La limite de résultat est obligatoire")
  .isInt({min: 1}).withMessage("La limite de résultat doit être un nombre entier supérieur ou égal à 1"),
  query("offset")
  .exists().withMessage("Le numéro de page est obligatoire")
  .isInt({min: 0}).withMessage("Le nombre de pages doit être un nombre entier supérieur ou égal à 0"),
];

export const getUserById = [
  param("id")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
];

export const warnUser = [
  param("id")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
  body("reason")
  .exists().withMessage("La raison est obligatoire")
  .isString().withMessage("La raison doit être une chaîne de caractères"),
];

export const unWarnUser = [
  param("id")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
  body("warnId")
  .exists().withMessage("L'id de l'avertissement est obligatoire")
  .isMongoId().withMessage("L'id de l'avertissement n'est pas valide"),
  body("reason")
  .optional()
  .isString().withMessage("La raison doit être une chaîne de caractères"),
];

export const muteUser = [
  param("id")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
  body("reason")
  .exists().withMessage("La raison est obligatoire")
  .isString().withMessage("La raison doit être une chaîne de caractères"),
  body("durationInMin")
  .exists().withMessage("La durée est obligatoire")
  .isInt({min: 1}).withMessage("La durée doit être un nombre entier supérieur ou égal à 1"),
];

export const unMuteUser = [
  param("id")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
  body("reason")
  .exists().withMessage("La raison est obligatoire")
  .isString().withMessage("La raison doit être une chaîne de caractères"),
];

export const banUser = [
  param("id")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
  body("reason")
  .exists().withMessage("La raison est obligatoire")
  .isString().withMessage("La raison doit être une chaîne de caractères"),
  body("durationInHours")
  .exists().withMessage("La durée est obligatoire")
  .isInt({min: 1}).withMessage("La durée doit être un nombre entier supérieur ou égal à 1"),
];

export const unBanUser = [
  param("id")
  .exists().withMessage("L'id de l'utilisateur est obligatoire")
  .isMongoId().withMessage("L'id de l'utilisateur n'est pas valide"),
  body("reason")
  .exists().withMessage("La raison est obligatoire")
  .isString().withMessage("La raison doit être une chaîne de caractères"),
];

export const getReports = [
  query("status")
  .exists().withMessage("Le statut est obligatoire")
  .isIn(['pending', 'resolved', 'rejected']).withMessage("Le statut doit être 'pending', 'resolved' ou 'rejected'"),
];

export const searchReports = [
  query("query")
  .exists().withMessage("Le champ recherche est obligatoire")
  .isString().withMessage("Le champ recherche doit être une chaîne de caractères"),
  query("limit")
  .exists().withMessage("La limite de résultat est obligatoire")
  .isInt({min: 1}).withMessage("La limite de résultat doit être un nombre entier supérieur ou égal à 1"),
  query("offset")
  .exists().withMessage("Le numéro de page est obligatoire")
  .isInt({min: 0}).withMessage("Le nombre de pages doit être un nombre entier supérieur ou égal à 0"),
];

export const getReportById = [
  param("id")
  .exists().withMessage("L'id du signalement est obligatoire")
  .isMongoId().withMessage("L'id du signalement n'est pas valide"),
];

export const changeReportStatus = [
  param("id")
  .exists().withMessage("L'id du signalement est obligatoire")
  .isMongoId().withMessage("L'id du signalement n'est pas valide"),
  body("status")
  .exists().withMessage("Le statut est obligatoire")
  .isIn(['pending', 'resolved', 'rejected']).withMessage("Le statut doit être 'pending', 'resolved' ou 'rejected'"),
];

export const searchReportedMessages = [
  query("query")
  .exists().withMessage("Le champ recherche est obligatoire")
  .isString().withMessage("Le champ recherche doit être une chaîne de caractères"),
  query("limit")
  .exists().withMessage("La limite de résultat est obligatoire")
  .isInt({min: 1}).withMessage("La limite de résultat doit être un nombre entier supérieur ou égal à 1"),
  query("offset")
  .exists().withMessage("Le numéro de page est obligatoire")
  .isInt({min: 0}).withMessage("Le nombre de pages doit être un nombre entier supérieur ou égal à 0"),
];

export const deleteReportedMessage = [
  param("id")
  .exists().withMessage("L'id du message est obligatoire")
  .isMongoId().withMessage("L'id du message n'est pas valide"),
  body("reason")
  .exists().withMessage("La raison est obligatoire")
  .isString().withMessage("La raison doit être une chaîne de caractères"),
];