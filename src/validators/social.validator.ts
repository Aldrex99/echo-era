import { body, param, query } from "express-validator";

export const searchUsers = [
  query("search")
  .isString()
  .withMessage("Le format de la recherche est incorrect"),
  query("limit")
  .optional()
  .isInt({min: 1})
  .withMessage("La limite est incorrecte"),
];

export const getOtherProfile = [
  param("otherUserId").isMongoId().withMessage("L'id de l'utilisateur est incorrect"),
];

export const addFriend = [
  param("receiverId").isMongoId().withMessage("L'id de l'utilisateur est incorrect"),
];

export const acceptFriendRequest = [
  param("requestId").isMongoId().withMessage("L'id de la requête est incorrect"),
];

export const declineFriendRequest = [
  param("requestId").isMongoId().withMessage("L'id de la requête est incorrect"),
];

export const cancelFriendRequest = [
  param("requestId").isMongoId().withMessage("L'id de la requête est incorrect"),
];

export const userIdValidation = [
  body("id").isMongoId().withMessage("L'id de l'utilisateur est incorrect"),
];

export const reportUser = [
  body("id").isMongoId().withMessage("L'id de l'utilisateur est incorrect"),
  body("message").optional().isMongoId().withMessage("L'id du message est incorrect"),
  body("reason").isString().withMessage("Le format de la raison est incorrecte"),
];