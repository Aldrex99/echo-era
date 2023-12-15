import { IRequestUser } from "../types/user.type";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validationErrors.util";
import * as messageService from '../services/message.service';

// Send message
export const sendMessage = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;
    const {content} = req.body;

    // Send message
    const message = await messageService.sendMessage(req.user.id, chatId, content);

    // Send response
    res.status(200).json({
      message: 'Message envoyé',
      messageData: message
    });
  } catch (err) {
    next(err);
  }
}

// Edit message
export const editMessage = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {messageId} = req.params;
    const {content} = req.body;

    // Edit message
    const message = await messageService.editMessage(req.user.id, messageId, content);

    // Send response
    res.status(200).json({
      message: 'Message modifié',
      messageData: message
    });
  } catch (err) {
    next(err);
  }
}

// Delete message
export const deleteMessage = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {messageId} = req.params;

    // Delete message
    const message = await messageService.deleteMessage(req.user.id, messageId);

    // Send response
    res.status(200).json({
      message: 'Message supprimé',
      messageData: message
    });
  } catch (err) {
    next(err);
  }
}

// Get chat messages
export const getChatMessages = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;
    const {limit, offset} = req.query;

    // Get chat messages
    const messages = await messageService.getChatMessages(req.user.id, chatId, parseInt(limit as string), parseInt(offset as string));

    // Send response
    res.status(200).json({
      message: 'Messages récupérés',
      messagesData: messages
    });
  } catch (err) {
    next(err);
  }
}

// Search messages in chat by content
export const searchMessages = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {chatId} = req.params;
    const {search, limit, offset} = req.query;

    // Search messages
    const messages = await messageService.searchMessages(req.user.id, chatId, search as string, parseInt(limit as string), parseInt(offset as string));

    // Send response
    res.status(200).json({
      message: 'Messages récupérés',
      messagesData: messages
    });
  } catch (err) {
    next(err);
  }
}

// Report message
export const reportMessage = async (req: IRequestUser, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  await validationErrorsUtil(errors, res);

  try {
    const {messageId} = req.params;
    const {reason} = req.body;

    // Report message
    await messageService.reportMessage(req.user.id, messageId, reason);

    // Send response
    res.status(200).json({
      message: 'Message signalé'
    });
  } catch (err) {
    next(err);
  }
}