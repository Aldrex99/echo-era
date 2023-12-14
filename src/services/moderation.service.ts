import User from "../models/User.model";
import Report from "../models/Report.model";
import { moderationLogUtil } from "../utils/moderationLog.util";
import { AppError } from "../utils/error.util";
import { ISearchFields, ISearchReportResult } from "../types/global.type";

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

export const getReports = async (status: string) => {
  return Report.find({status});
}

export const getReportsByMultipleFields = async (fields: ISearchFields[], query: string, offset: number, limit: number) => {
  if (offset < 1 || limit < 1) {
    throw new AppError("Les paramètres limit et offset doivent être supérieurs à 0", 422);
  }

  // Get reports by reason, from username, to username, from email, to email, from usernameOnDelete, to usernameOnDelete, from emailOnDelete, to emailOnDelete, from username in PreviousUsername, to username in PreviousUsername, from email in PreviousEmail, to email in PreviousEmail
  const reports: ISearchReportResult[] = await Report.find().populate("fromUser", "username email usernameOnDelete emailOnDelete previousNames previousEmail").populate("toUser", "username email usernameOnDelete emailOnDelete previousNames previousEmail");

  // Filter reports
  const filteredReports = reports.filter((report) => {
    let isReport = false;

    console.log(report)

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      switch (field.field) {
        case "reason":
          console.log("reason", report?.reason?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.reason?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "fromUsername":
          console.log("fromUsername", report?.fromUser?.username?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.fromUser?.username?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "toUsername":
          console.log("toUsername", report?.toUser?.username?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.toUser?.username?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "fromEmail":
          console.log("fromEmail", report?.fromUser?.email?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.fromUser?.email?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "toEmail":
          console.log("toEmail", report?.toUser?.email?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.toUser?.email?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "fromUsernameOnDelete":
          console.log("fromUsernameOnDelete", report?.fromUser?.usernameOnDelete?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.fromUser?.usernameOnDelete?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "toUsernameOnDelete":
          console.log("toUsernameOnDelete", report?.toUser?.usernameOnDelete?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.toUser?.usernameOnDelete?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "fromEmailOnDelete":
          console.log("fromEmailOnDelete", report?.fromUser?.emailOnDelete?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.fromUser?.emailOnDelete?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "toEmailOnDelete":
          console.log("toEmailOnDelete", report?.toUser?.emailOnDelete?.toLowerCase().includes(query?.toLowerCase()));
          isReport = report?.toUser?.emailOnDelete?.toLowerCase().includes(query?.toLowerCase()) || isReport;
          break;
        case "fromUsernameInPreviousUsername":
          console.log("fromUsernameInPreviousUsername", report?.fromUser?.previousNames?.map(pn => pn.username)?.includes(query?.toLowerCase()));
          const previousNames = report?.fromUser?.previousNames?.map(pn => pn.username);

          isReport = previousNames?.includes(query?.toLowerCase()) || isReport;
          break;
        case "toUsernameInPreviousUsername":
          console.log("toUsernameInPreviousUsername", report?.toUser?.previousNames?.map(pn => pn.username)?.includes(query?.toLowerCase()));
          const previousNames2 = report?.toUser?.previousNames?.map(pn => pn.username);

          isReport = previousNames2?.includes(query?.toLowerCase()) || isReport;
          break;
        case "fromEmailInPreviousEmail":
          console.log("fromEmailInPreviousEmail", report?.fromUser?.previousEmail?.map(pe => pe.email)?.includes(query?.toLowerCase()));
          const previousEmails = report?.fromUser?.previousEmail?.map(pe => pe.email);

          isReport = previousEmails?.includes(query?.toLowerCase()) || isReport;
          break;
        case "toEmailInPreviousEmail":
          console.log("toEmailInPreviousEmail", report?.toUser?.previousEmail?.map(pe => pe.email)?.includes(query?.toLowerCase()));
          const previousEmails2 = report?.toUser?.previousEmail?.map(pe => pe.email);

          isReport = previousEmails2?.includes(query?.toLowerCase()) || isReport;
          break;
        default:
          break;
      }
    }
    return isReport;
  });

  // Sort reports by date
  const sortedReports = filteredReports.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  // Paginate reports
  return sortedReports.slice(offset - 1, offset - 1 + limit);
}