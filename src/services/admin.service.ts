import User from "../models/User.model";
import Chat from "../models/Chat.model";
import ModerationLog from "../models/ModerationLog.model";
import { AppError } from "../utils/error.util";
import { IChatCreation } from "../types/chat.type";
import { moderationLogUtil } from "../utils/moderationLog.util";
import ReportReason from "../models/ReportReason.model";

export const addModerator = async (newModeratorId: string, adminId: string) => {
  const user = await User.findById(newModeratorId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  if (user.role === "moderator") {
    throw new AppError("L'utilisateur est déjà modérateur", 400);
  }

  user.role = "moderator";
  user.lastLogout = new Date();

  await user.save();

  await moderationLogUtil(adminId, newModeratorId, "addModerator", "moderator");
}

export const removeModerator = async (moderatorId: string, adminId: string) => {
  const user = await User.findById(moderatorId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  if (user.role === "user") {
    throw new AppError("L'utilisateur n'est pas modérateur", 400);
  }

  user.role = "user";
  user.lastLogout = new Date();

  await user.save();

  await moderationLogUtil(adminId, moderatorId, "removeModerator", "moderator");
}

export const createGlobalChat = async (data: IChatCreation, adminId: string) => {
  const newGlobalChat = new Chat({
    name: data.name,
    description: data.description,
    type: "public",
    participants: [],
  });

  await newGlobalChat.save();

  await moderationLogUtil(adminId, adminId, "createGlobalChat", `Création du chat ${data.name} ayant pour id ${newGlobalChat._id}`);
}

export const modifyGlobalChat = async (chatId: string, data: IChatCreation, adminId: string) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new AppError("Chat introuvable", 404);
  }

  chat.name = data.name;
  chat.description = data.description;

  await chat.save();

  await moderationLogUtil(adminId, adminId, "modifyGlobalChat", `Modification du chat ${data.name} ayant pour id ${chat._id}`);
}

export const deleteGlobalChat = async (chatId: string, adminId: string) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new AppError("Chat introuvable", 404);
  }

  await Chat.findOneAndDelete({_id: chatId});

  await moderationLogUtil(adminId, adminId, "deleteGlobalChat", `Suppression du chat ${chat.name} ayant pour id ${chat._id}`);
}

export const getModerationLogs = async (offset: number, limit: number) => {
  const logs = await ModerationLog.find().sort({date: -1}).skip(offset * limit).limit(limit).populate("moderator", "username").populate("affectedUser", "username");

  const total = await ModerationLog.countDocuments();

  return {logs, total};
}

export const createReportReason = async (category: string, reason: string, priority: number, adminId: string) => {
  const newReportReason = new ReportReason({
    category,
    reason,
    priority,
  });

  await newReportReason.save();

  await moderationLogUtil(adminId, adminId, "createReportReason", `Création de la raison de report ${reason} ayant pour id ${newReportReason._id}`);
}