import { NextFunction, Response } from "express";
import { IRequestUser } from "../types/user.type";
import * as moderationService from '../services/moderation.service';
import { ISearchFields } from "../types/global.type";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";

// Get all users
export const getAllUsers = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {limit, offset, sort = 'username', direction = 'asc'} = req.query;

    const order = direction === 'asc' ? 1 : -1;

    const users = await moderationService.getAllUsers(parseInt(offset as string), parseInt(limit as string), sort as string, order);

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: users.users,
      total: users.total,
    });
  } catch (err) {
    next(err);
  }
}

// Search users by usernames, previousNames, emails, previousEmails, usernameOnDelete, emailOnDelete
export const searchUsers = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {search, limit, offset} = req.query;

    const users = await moderationService.searchUsers(search as string, parseInt(offset as string), parseInt(limit as string));

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: users.users,
      total: users.total,
    });
  } catch (err) {
    next(err);
  }
}

// Get user by id
export const getUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;

    const user = await moderationService.getUser(userId);

    return res.status(200).json({
      message: "Utilisateur récupéré",
      user: user,
    });
  } catch (err) {
    next(err);
  }
}

// Warn user
export const warnUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;
    const {reason} = req.body;

    await moderationService.warnUser(userId, reason, req.user.id);

    return res.status(200).json({
      message: "Utilisateur averti",
    });
  } catch (err) {
    next(err);
  }
}

// unWarn user
export const unWornUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;

    const {warnId, reason} = req.body;

    await moderationService.unWornUser(userId, warnId, reason, req.user.id);

    return res.status(200).json({
      message: "Avertissement supprimé",
    });
  } catch (err) {
    next(err);
  }

}

// Mute user
export const muteUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;
    const {reason, durationInMin} = req.body;

    await moderationService.muteUser(userId, reason, durationInMin, req.user.id);

    return res.status(200).json({
      message: "Utilisateur muté",
    });
  } catch (err) {
    next(err);
  }
}

// Unmute user
export const unMuteUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;
    const {reason} = req.body;

    await moderationService.unMuteUser(userId, req.user.id, reason);

    return res.status(200).json({
      message: "Utilisateur démuté",
    });
  } catch (err) {
    next(err);
  }
}

// Ban user
export const banUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;
    const {reason, durationInHours} = req.body;

    await moderationService.banUser(userId, reason, durationInHours, req.user.id);

    return res.status(200).json({
      message: "Utilisateur banni",
    });
  } catch (err) {
    next(err);
  }
}

// Unban user
export const unBanUser = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {userId} = req.params;
    const {reason} = req.body;

    await moderationService.unBanUser(userId, req.user.id, reason);

    return res.status(200).json({
      message: "Utilisateur débanni",
    });
  } catch (err) {
    next(err);
  }
}

// Get all users are warnings
export const getAllUsersAreWarnings = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const users = await moderationService.getAllUsersAreWarnings();

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: users,
    });
  } catch (err) {
    next(err);
  }
}

// Get all users are muted
export const getAllUsersAreMuted = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const users = await moderationService.getAllUsersAreMuted();

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: users,
    });
  } catch (err) {
    next(err);
  }
}

// Get all users are banned
export const getAllUsersAreBanned = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const users = await moderationService.getAllUsersAreBanned();

    return res.status(200).json({
      message: "Utilisateurs récupérés",
      users: users,
    });
  } catch (err) {
    next(err);
  }
}

// Get reports by status
export const getReports = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {status, offset, limit} = req.query;

    const reports = await moderationService.getReports(status as string, parseInt(offset as string), parseInt(limit as string));

    return res.status(200).json({
      message: "Signalements récupérés",
      reports: reports.reports,
      total: reports.total,
    });
  } catch (err) {
    next(err);
  }
}

// Search reports by reason, from username, to username, from usernameOnDelete, to usernameOnDelete
export const searchReports = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {search, limit, offset} = req.query;
    const fields: ISearchFields[] = [
      {field: 'reason'},
      {field: 'fromUsername'},
      {field: 'toUsername'},
      {field: 'fromUsernameOnDelete'},
      {field: 'toUsernameOnDelete'},
      {field: 'fromUsernameInPreviousUsername'},
      {field: 'toUsernameInPreviousUsername'},
    ];

    const reports = await moderationService.getReportsByMultipleFields(fields, search as string, parseInt(offset as string), parseInt(limit as string));

    return res.status(200).json({
      message: "Signalements récupérés",
      reports: reports.reports,
      total: reports.total,
    });
  } catch (err) {
    next(err);
  }
}

// Get report by id
export const getReportById = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {reportId} = req.params;

    const report = await moderationService.getReportById(reportId);

    return res.status(200).json({
      message: "Signalement récupéré",
      report: report,
    });
  } catch (err) {
    next(err);
  }
}

export const addCommentToReport = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {reportId} = req.params;
    const {comment} = req.body;

    await moderationService.addCommentToReport(reportId, comment, req.user.id);

    return res.status(200).json({
      message: "Commentaire ajouté",
    });
  } catch (err) {
    next(err);
  }

}

// Change report status
export const changeReportStatus = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {reportId} = req.params;
    const {status} = req.body;

    await moderationService.changeReportStatus(reportId, status, req.user.id);

    return res.status(200).json({
      message: "Statut du signalement modifié",
    });
  } catch (err) {
    next(err);
  }
}

// Get reported messages
export const getReportedMessages = async (req: IRequestUser, res: Response, next: NextFunction) => {
  try {
    const message = await moderationService.getReportedMessages();

    return res.status(200).json({
      message: "Message récupéré",
      reportedMessage: message,
    });
  } catch (err) {
    next(err);
  }
}

// Search reported messages
export const searchReportedMessages = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {query, limit, offset} = req.query;
    const fields: ISearchFields[] = [
      {field: 'content'},
      {field: 'senderUsername'},
      {field: 'readByUsername'},
      {field: 'editByUsername'},
    ];

    const messages = await moderationService.getReportedMessagesByMultipleFields(fields, query as string, parseInt(offset as string), parseInt(limit as string));

    return res.status(200).json({
      message: "Messages récupérés",
      reportedMessages: messages,
    });
  } catch (err) {
    next(err);
  }
}

// Delete reported message
export const deleteReportedMessage = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {id} = req.params;
    const {reason} = req.body;

    await moderationService.deleteReportedMessage(id, req.user.id, reason);

    return res.status(200).json({
      message: "Message supprimé",
    });
  } catch (err) {
    next(err);
  }
}