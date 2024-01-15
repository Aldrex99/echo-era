import { IRequestUser } from "../types/user.type";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";
import * as adminService from "../services/admin.service";
import { IChatCreation } from "../types/chat.type";

// Add new moderator
export const addModerator = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;

    await adminService.addModerator(userId, req.user.id);

    return res.status(200).json({
      message: "Modérateur ajouté",
    });
  } catch (err) {
    next(err);
  }
}

// Remove moderator
export const removeModerator = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;

    await adminService.removeModerator(userId, req.user.id);

    return res.status(200).json({
      message: "Modérateur supprimé",
    });
  } catch (err) {
    next(err);
  }
}

// Create new global chat
export const createGlobalChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const chat: IChatCreation = {
      name: req.body.name,
      description: req.body.description,
      type: "public",
      participants: [],
    }

    await adminService.createGlobalChat(chat, req.user.id);

    return res.status(200).json({
      message: "Chat créé",
    });
  } catch (err) {
    next(err);
  }
}

// Modify global chat
export const modifyGlobalChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;

    const chat = await adminService.modifyGlobalChat(chatId, req.body, req.user.id);

    return res.status(200).json({
      message: "Chat modifié",
      chat: chat,
    });
  } catch (err) {
    next(err);
  }
}

// Delete global chat
export const deleteGlobalChat = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;

    await adminService.deleteGlobalChat(chatId, req.user.id);

    return res.status(200).json({
      message: "Chat supprimé",
    });
  } catch (err) {
    next(err);
  }
}

// Get moderation logs
export const getModerationLogs = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {limit, offset} = req.query;

    const logs = await adminService.getModerationLogs(parseInt(offset as string), parseInt(limit as string));

    return res.status(200).json({
      message: "Logs récupérés",
      logs: logs.logs,
      total: logs.total,
    });
  } catch (err) {
    next(err);
  }
}

export const createReportReason = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {category, reason, priority} = req.body;

    await adminService.createReportReason(category, reason, priority, req.user.id);

    return res.status(200).json({
      message: "Raison de signalement créée",
    });
  } catch (err) {
    next(err);
  }
}