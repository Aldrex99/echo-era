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