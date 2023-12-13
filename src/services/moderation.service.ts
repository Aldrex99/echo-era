import User from "../models/User.model";
import { moderationLogUtil } from "../utils/moderationLog.util";
import { AppError } from "../utils/error.util";

export const getAllUsers = async () => {
  return User.find();
}

export const getUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  return user;
}

export const warnUser = async (userId: string, reason: string, warnerId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Create moderation log
  await moderationLogUtil(warnerId, userId, "warn", reason);

  // Warn user
  user.warnings.push({
    by: warnerId,
    reason,
    date: new Date(),
  });

  return user.save();
}

export const unWarnUser = async (userId: string, warnId: string, reason: string, moderatorId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Check if warn exists
  const warn = user.warnings.find(warn => warn._id.toString() === warnId);

  if (!warn) {
    throw new AppError("Avertissement introuvable", 404);
  }

  // Remove warn
  await User.findOneAndUpdate({_id: userId}, {$pull: {warnings: {_id: warnId}}});

  // Create moderation log
  await moderationLogUtil(moderatorId, userId, "unwarn", reason ? reason : warn.reason);
}

export const muteUser = async (userId: string, reason: string, durationInMin: number, muterId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Check if user is already muted
  if (user.isMuted) {
    throw new AppError("Utilisateur déjà muté", 422);
  }

  // Create moderation log
  await moderationLogUtil(muterId, userId, "mute", reason);

  // Mute user
  user.isMuted = true;
  user.muteDuration = durationInMin;
  user.muteExpiresAt = new Date(Date.now() + durationInMin * 60000);

  const reasonAggrement = reason + ` Durée : ${durationInMin} minutes`;

  user.sanctionReason.push({
    reason: reasonAggrement,
    type: "mute",
    date: new Date(),
  });

  return user.save();
}

export const unMuteUser = async (userId: string, moderatorId: string, reason: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Check if user is muted
  if (!user.isMuted) {
    throw new AppError("Utilisateur non muté", 422);
  }

  // Create moderation log
  await moderationLogUtil(moderatorId, userId, "unmute", reason);

  // Unmute user
  user.isMuted = false;
  user.muteDuration = null;
  user.muteExpiresAt = null;

  return user.save();
}

export const banUser = async (userId: string, reason: string, durationInHours: number, bannerId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Check if user is already banned
  if (user.isBanned) {
    throw new AppError("Utilisateur déjà banni", 422);
  }

  // Create moderation log
  await moderationLogUtil(bannerId, userId, "ban", reason);

  // Ban user
  user.isBanned = true;
  user.banDuration = durationInHours;
  user.banExpiresAt = new Date(Date.now() + durationInHours * 3600000);

  const reasonAggrement = reason + ` Durée : ${durationInHours} heures`;

  user.sanctionReason.push({
    reason: reasonAggrement,
    type: "ban",
    date: new Date(),
  });

  return user.save();
}

export const unBanUser = async (userId: string, moderatorId: string, reason: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  // Check if user is banned
  if (!user.isBanned) {
    throw new AppError("Utilisateur non banni", 422);
  }

  // Create moderation log
  await moderationLogUtil(moderatorId, userId, "unban", reason);

  // Unban user
  user.isBanned = false;
  user.banDuration = null;
  user.banExpiresAt = null;

  return user.save();
}

export const getAllUsersAreWarnings = async () => {
  return User.find({warnings: {$not: {$size: 0}}});
}

export const getAllUsersAreMuted = async () => {
  return User.find({isMuted: true});
}

export const getAllUsersAreBanned = async () => {
  return User.find({isBanned: true});
}