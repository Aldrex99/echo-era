import Message from "../models/Message.model";
import Chat from "../models/Chat.model";
import Report from "../models/Report.model";
import { AppError } from "../utils/error.util";
import { ObjectId } from "mongodb";
import User from "../models/User.model";

export const sendMessage = async (senderId: string, chatId: string, content: string) => {
  // Check if chat exists
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Check if user is in the chat
  const participant = chat.participants.find(participant => participant.user.toString() === senderId);
  if (!participant) {
    throw new AppError("Vous n'êtes pas dans ce chat", 403);
  }

  const message = new Message({
    sender: senderId,
    chat: chatId,
    content
  });
  await message.save();
  return message;
}

export const editMessage = async (modifierId: string, messageId: string, content: string) => {
  // Retrieve message
  const message = await Message.findById(messageId);

  // Check if message exists
  if (!message) {
    throw new AppError("Le message n'existe pas", 404);
  }

  // Check if user is the sender
  if (message.sender.toString() !== modifierId) {
    throw new AppError("Vous n'êtes pas l'auteur du message", 403);
  }

  // Check if message is deleted
  if (message.deleted) {
    throw new AppError("Le message a été supprimé", 403);
  }

  // Edit message
  message.editHistory.push({
    date: Date.now(),
    content: message.content,
    by: message.sender,
    role: 'sender'
  });
  message.content = content;
  await message.save();
  return message;
}

export const deleteMessage = async (deleteId: string, messageId: string) => {
  // Retrieve message
  const message = await Message.findById(messageId);

  // Check if message exists
  if (!message) {
    throw new AppError("Le message n'existe pas", 404);
  }

  // Check if user is the sender
  if (message.sender.toString() !== deleteId) {
    throw new AppError("Vous n'êtes pas l'auteur du message", 403);
  }

  // Check if message is deleted
  if (message.deleted) {
    throw new AppError("Le message à déjà été supprimé", 403);
  }

  // Delete message and add deletedBy
  message.deleted = true;
  message.deletedBy.push(new ObjectId(deleteId));
  await message.save();

  return message;
}

export const getChatMessages = async (userId: string, chatId: string, limit: number, offset: number) => {
  if (offset < 1 || limit < 1) {
    throw new AppError("Les paramètres limit et offset doivent être supérieurs à 0", 422);
  }

  // Check if chat exists
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Check if user is in the chat
  const participant = chat.participants.find(participant => participant.user.toString() === userId);
  if (!participant) {
    throw new AppError("Vous n'êtes pas dans ce chat", 403);
  }

  // Get chat messages
  const message = await Message.find({chat: chatId}, {
    _id: 1,
    sender: 1,
    chat: 1,
    content: 1,
    date: 1,
    readBy: 1,
    editHistory: 1
  })
  .sort({date: -1})
  .skip(offset - 1)
  .limit(limit)
  .populate('sender', 'username')
  .populate('readBy', 'username')
  .populate('editHistory.by', 'username');

  // Get blocked user ids
  const blockedUsers = await User.find({_id: userId}, {blockedUsers: 1});

  // Replace message content by "Utilisateur bloqué" if user is blocked
  message.forEach(message => {
    const blocked = blockedUsers[0].blockedUsers.find(blockedUser => blockedUser.user.toString() === message.sender._id.toString());
    if (blocked) {
      message.content = "Utilisateur bloqué";
    }
    if (message.deleted) {
      message.content = "Message supprimé";
    }
  });

  return message;
}

export const searchMessages = async (userId: string, chatId: string, search: string, limit: number, offset: number) => {
  if (offset < 1 || limit < 1) {
    throw new AppError("Les paramètres limit et offset doivent être supérieurs à 0", 422);
  }

  // Check if chat exists
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Search messages
  const message = await Message.find({$and: [{chat: chatId}, {content: {$regex: search, $options: 'i'}}]}, {
    _id: 1,
    sender: 1,
    chat: 1,
    content: 1,
    date: 1,
    readBy: 1,
    editHistory: 1
  })
  .sort({date: -1})
  .skip(offset - 1)
  .limit(limit)
  .populate('sender', 'username')
  .populate('readBy', 'username')
  .populate('editHistory.by', 'username');

  // Get blocked user ids
  const blockedUsers = await User.find({_id: userId}, {blockedUsers: 1});

  // Replace message content by "Utilisateur bloqué" if user is blocked
  message.forEach(message => {
    const blocked = blockedUsers[0].blockedUsers.find(blockedUser => blockedUser.user.toString() === message.sender._id.toString());
    if (blocked) {
      message.content = "Utilisateur bloqué";
    }
    if (message.deleted) {
      message.content = "Message supprimé";
    }
  });

  return message;
}

export const reportMessage = async (reporterId: string, messageId: string, reason: string) => {
  // Retrieve message
  const message = await Message.findById(messageId);

  // Check if message exists
  if (!message) {
    throw new AppError("Le message n'existe pas", 404);
  }

  // Check if message is deleted
  if (message.deleted) {
    throw new AppError("Le message a été supprimé", 403);
  }

  // Check if user has already reported the message
  const alreadyReported = message.flaggedBy.find(userId => userId.toString() === reporterId);
  if (alreadyReported) {
    throw new AppError("Vous avez déjà signalé ce message", 403);
  }

  // Report message
  message.flaggedBy.push(new ObjectId(reporterId));

  // Check if message is flagged
  if (message.flaggedBy.length >= 5) {
    message.moderationStatus = 'flagged';
  }

  await message.save();

  // Add a new report
  const report = new Report({
    fromUser: reporterId,
    toUser: message.sender,
    messageId,
    reason
  });

  await report.save();

  return message;
}