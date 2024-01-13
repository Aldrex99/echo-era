import { NextFunction, Response } from "express";
import { IRequestUser } from "../types/user.type";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";
import * as chatService from "../services/chat.service";
import { IChatCreation, IGetChat } from "../types/chat.type";
import { classicFailOrErrorResponse } from "../utils/error.util";

const participantRoleVerify = async (acceptedRole: string[], chat: IGetChat, userId: string, res: Response) => {
  const participant = chat.participants.find(participant => participant.id.toString() === userId);
  if (participant === undefined || !acceptedRole.includes(participant.role)) {
    return classicFailOrErrorResponse("Vous n'êtes pas autorisé à ajouter un utilisateur à ce chat", 403, res);
  }
}

// Create chat
export const createChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {name, description, type, participants} = req.body;

    // Only admin can create a public chat
    if (type === "public" && req.user.role !== "admin") {
      return classicFailOrErrorResponse("Vous n'êtes pas autorisé à créer un chat public", 403, res);
    }

    // For group chat, 3 participants minimum
    if (type === "group" && participants.length < 2) {
      return classicFailOrErrorResponse("Un chat de groupe doit avoir au moins 3 participants", 422, res);
    }

    // Can't create a chat with himself
    if (participants.includes(req.user.id)) {
      return classicFailOrErrorResponse("Vous ne pouvez pas créer un chat avec vous-même", 422, res);
    }

    // Can't create a private chat
    if (type === "private") {
      return classicFailOrErrorResponse("Vous ne pouvez pas créer un chat privé", 422, res);
    }

    // Create chat data
    const data: IChatCreation = {
      name,
      description: description ? description : "",
      type,
      participants: [{user: req.user.id, role: "admin"}],
    }

    // Create chat
    const chat = await chatService.createChat(data, participants);

    return res.status(201).json({
      message: "Chat créé",
      chat,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get user chats
export const getUserChats = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {limit, offset} = req.query;

    // Get chats
    const chats = await chatService.getUserChats(req.user.id, parseInt(limit as string), parseInt(offset as string));

    return res.status(200).json({
      message: "Chats récupérés",
      chats: chats.chats,
      total: chats.total,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get chat info
export const getChatInfo = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.params;

    // Check if user is participant of the chat if it's not a public chat
    const chat = await chatService.getChatInfo(id);
    if (chat.type !== "public" && !chat.participants.find(participant => participant.id.toString() === req.user.id)) {
      return classicFailOrErrorResponse("Vous n'êtes pas autorisé à accéder à ce chat", 403, res);
    }

    // Get chat
    const chatInfo = await chatService.getChatInfo(id);

    return res.status(200).json({
      message: "Chat récupéré",
      chatInfo,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Send chat request
export const addUserToChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.params;

    // Check if user is admin or moderator of the chat
    const chat = await chatService.getChatInfo(id);

    // Check if user is admin or moderator of the chat
    await participantRoleVerify(["admin", "moderator"], chat, req.user.id, res);

    // Add user to chat
    await chatService.addUserToChat(id, req.body.userId);

    return res.status(200).json({
      message: "Invitation au chat envoyée",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Get chat request
export const getChatRequests = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    // Get chats requests
    const requests = await chatService.getChatRequests(req.user.id);

    return res.status(200).json({
      message: "Demandes de chat récupérées",
      requests: requests,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Accept chat request
export const acceptChatRequest = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {requestId} = req.params;

    // Accept chat invitation
    await chatService.acceptChatRequest(requestId, req.user.id);

    return res.status(200).json({
      message: "Invitation au chat acceptée",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Decline chat request
export const declineChatRequest = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {requestId} = req.params;

    // Decline chat invitation
    await chatService.declineChatRequest(requestId, req.user.id);

    return res.status(200).json({
      message: "Invitation au chat refusée",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Update chat info
export const updateChatInfo = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;

    // Check if user is admin or moderator of the chat
    const chat = await chatService.getChatInfo(chatId);
    await participantRoleVerify(["admin", "moderator"], chat, req.user.id, res);

    // Check if chat type is group
    if (chat.type !== "group") {
      return classicFailOrErrorResponse("Vous n'êtes pas autorisé à modifier ce chat", 403, res);
    }

    // Update chat info
    await chatService.updateChatInfo(chatId, req.body);

    return res.status(200).json({
      message: "Informations du chat mises à jour",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Update chat participant role (only for group chat and admin of the chat)
export const updateChatParticipantRole = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId, userId} = req.params;

    // Check if user is admin of the chat
    const chat = await chatService.getChatInfo(chatId);
    await participantRoleVerify(["admin"], chat, req.user.id, res);

    const participantToChange = chat.participants.find(participant => participant.id.toString() === userId);
    if (participantToChange === undefined) {
      return classicFailOrErrorResponse("L'utilisateur n'est pas dans le chat", 422, res);
    }

    // Update chat participant role
    await chatService.updateChatParticipantRole(chatId, userId, req.body.role);

    return res.status(200).json({
      message: "Rôle du participant mis à jour",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Remove user from chat
export const removeUserFromChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId, userId} = req.params;

    // Check if user is admin or moderator of the chat
    const chat = await chatService.getChatInfo(chatId);
    await participantRoleVerify(["admin", "moderator"], chat, req.user.id, res);

    // Remove user from chat
    await chatService.removeUserFromChat(chatId, userId, req.user.id);

    return res.status(200).json({
      message: "Utilisateur supprimé du chat",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Leave chat
export const leaveChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;

    // Leave chat
    await chatService.leaveChat(chatId, req.user.id);

    return res.status(200).json({
      message: "Vous avez quitté le chat",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Delete chat
export const deleteChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;

    // Check if user is admin of the chat
    const chat = await chatService.getChatInfo(chatId);
    await participantRoleVerify(["admin"], chat, req.user.id, res);

    // Delete chat
    await chatService.deleteChat(chatId, req.user.id);

    return res.status(200).json({
      message: "Chat supprimé",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}

// Search chats by name or part of name (only for participants)
export const searchChats = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {search} = req.query;

    // Get chats
    const chats = await chatService.searchChats(req.user.id, search as string);

    return res.status(200).json({
      message: "Chats récupérés",
      chats: chats.chats,
      total: chats.total,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
}