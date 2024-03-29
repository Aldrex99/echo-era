import User from "../models/User.model";
import Report from "../models/Report.model";
import { moderationLogUtil } from "../utils/moderationLog.util";
import { AppError } from "../utils/error.util";
import { IReportedMessage, ISearchFields, ISearchReportResult } from "../types/global.type";
import Message from "../models/Message.model";
import { ObjectId } from "mongodb";

export const getAllUsers = async (offset: number, limit: number, sortField: string, sortOrder: number) => {
  const sortOptions = {};
  sortOptions[sortField] = sortOrder;

  const users = await User.find({}, {
    _id: 1,
    username: 1,
    role: 1,
    isActive: 1,
    warnings: 1,
    isMuted: 1,
    isBanned: 1,
    sanctionReason: 1
  }).sort(sortOptions).skip(offset * limit).limit(limit);

  return {
    users,
    total: await User.countDocuments(),
  };
}

export const searchUsers = async (search: string, offset: number, limit: number) => {
  const queryConditions = {
    $or: [{
      username: {
        $regex: search,
        $options: "i"
      }
    }, {previousNames: {$elemMatch: {username: {$regex: search, $options: "i"}}}}, {
      usernameOnDelete: {
        $regex: search,
        $options: "i"
      }
    }]
  };

  const users = await User.find(queryConditions, {
    _id: 1,
    username: 1,
    role: 1,
    isActive: 1,
    warnings: 1,
    isMuted: 1,
    isBanned: 1,
    sanctionReason: 1
  }).skip(offset * limit).limit(limit);

  return {
    users,
    total: await User.countDocuments(queryConditions),
  }
}

export const getUser = async (id: string) => {
  return User.findById(id, {
    _id: 1,
    username: 1,
    profile: 1,
    role: 1,
    previousNames: 1,
    usernameOnDelete: 1,
    isActive: 1,
    warnings: 1,
    isMuted: 1,
    muteDuration: 1,
    muteExpiresAt: 1,
    isBanned: 1,
    banDuration: 1,
    banExpiresAt: 1,
    sanctionReason: 1,
  });
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

  // Create moderation log
  await moderationLogUtil(warnerId, userId, "warn", reason);

  // Warn user
  user.warnings.push({
    by: warnerId,
    reason,
    date: new Date(),
  });

  await user.save();
}

export const unWornUser = async (userId: string, warnId: string, reason: string, moderatorId: string) => {
  const user = await getUserById(userId);

  // Check if warn exists
  const warn = user.warnings.find(warn => warn._id.toString() === warnId);

  if (!warn) {
    throw new AppError("Avertissement introuvable", 404);
  }

  // Remove warn
  await User.findOneAndUpdate({_id: userId}, {$pull: {warnings: {_id: warnId}}});

  // Create moderation log
  await moderationLogUtil(moderatorId, userId, "unworn", reason ? reason : warn.reason);
}

export const muteUser = async (userId: string, reason: string, durationInMin: number, muterId: string) => {
  const user = await getUserById(userId);

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

  const reasonAgreement = reason + ` Durée : ${durationInMin} minutes`;

  user.sanctionReason.push({
    reason: reasonAgreement,
    type: "mute",
    date: new Date(),
  });

  await user.save();
}

export const unMuteUser = async (userId: string, moderatorId: string, reason: string) => {
  const user = await getUserById(userId);

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

  await user.save();
}

export const banUser = async (userId: string, reason: string, durationInHours: number, bannerId: string) => {
  const user = await getUserById(userId);

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

  const reasonAgreement = reason + ` Durée : ${durationInHours} heures`;

  user.sanctionReason.push({
    reason: reasonAgreement,
    type: "ban",
    date: new Date(),
  });

  await user.save();
}

export const unBanUser = async (userId: string, moderatorId: string, reason: string) => {
  const user = await getUserById(userId);

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

  await user.save();
}

export const getAllUsersAreWarnings = async () => {
  return User.find({warnings: {$not: {$size: 0}}}, {
    _id: 1,
    username: 1,
    role: 1,
    isActive: 1,
    warnings: 1,
    isMuted: 1,
    isBanned: 1,
    sanctionReason: 1
  });
}

export const getAllUsersAreMuted = async () => {
  return User.find({isMuted: true}, {
    _id: 1,
    username: 1,
    role: 1,
    isActive: 1,
    warnings: 1,
    isMuted: 1,
    isBanned: 1,
    sanctionReason: 1
  });
}

export const getAllUsersAreBanned = async () => {
  return User.find({isBanned: true}, {
    _id: 1,
    username: 1,
    role: 1,
    isActive: 1,
    warnings: 1,
    isMuted: 1,
    isBanned: 1,
    sanctionReason: 1
  });
}

export const getReports = async (status: string, offset: number, limit: number) => {
  const reports = await Report.find({status}, {__v: 0})
    .populate("fromUser", "username")
    .populate("toUser", "username")
    .populate("messageId", "content")
    .sort({date: -1})
    .skip(offset * limit)
    .limit(limit)

  return {
    reports,
    total: await Report.countDocuments({status}),
  }
}

export const getReportsByMultipleFields = async (fields: ISearchFields[], search: string, offset: number, limit: number) => {
  // Get reports by reason, from username, to username, from email, to email, from usernameOnDelete, to usernameOnDelete, from emailOnDelete, to emailOnDelete, from username in PreviousUsername, to username in PreviousUsername, from email in PreviousEmail, to email in PreviousEmail
  const reports: ISearchReportResult[] = await Report.find({}, {__v: 0}).populate("fromUser", "username usernameOnDelete previousNames").populate("toUser", "username usernameOnDelete previousNames");

  // Filter reports
  const filteredReports = reports.filter((report) => {
    let isReport = false;

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      switch (field.field) {
        case "reason":
          isReport = report?.reason?.toLowerCase().includes(search?.toLowerCase()) || isReport;
          break;
        case "fromUsername":
          isReport = report?.fromUser?.username?.toLowerCase().includes(search?.toLowerCase()) || isReport;
          break;
        case "toUsername":
          isReport = report?.toUser?.username?.toLowerCase().includes(search?.toLowerCase()) || isReport;
          break;
        case "fromUsernameOnDelete":
          isReport = report?.fromUser?.usernameOnDelete?.toLowerCase().includes(search?.toLowerCase()) || isReport;
          break;
        case "toUsernameOnDelete":
          isReport = report?.toUser?.usernameOnDelete?.toLowerCase().includes(search?.toLowerCase()) || isReport;
          break;
        case "fromUsernameInPreviousUsername":
          const previousNames = report?.fromUser?.previousNames?.map(pn => pn.username);

          isReport = previousNames?.includes(search?.toLowerCase()) || isReport;
          break;
        case "toUsernameInPreviousUsername":
          const previousNames2 = report?.toUser?.previousNames?.map(pn => pn.username);

          isReport = previousNames2?.includes(search?.toLowerCase()) || isReport;
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
  return {
    reports: sortedReports.slice(offset, offset + limit),
    total: sortedReports.length,
  };
}

export const getReportById = async (reportId: string) => {
  const report = await Report.findById(reportId, {__v: 0}).populate("fromUser", "username").populate("toUser", "username").populate("messageId", "content");

  if (!report) {
    throw new AppError("Signalement introuvable", 404);
  }

  return report;
}

export const changeReportStatus = async (reportId: string, status: "pending" | "resolved" | "rejected", moderatorId: string) => {
  const report = await getReportById(reportId);

  if (!report) {
    throw new AppError("Signalement introuvable", 404);
  }

  // Change report status
  report.status = status;

  // Create moderation log
  await moderationLogUtil(moderatorId, report.toUser._id.toString(), 'status', `Signalement ${status}, reportId: ${reportId}`);

  await report.save();
}

export const getReportedMessages = async () => {
  return Message.find({moderationStatus: "flagged"}).populate("sender", "username").populate("readBy", "username").populate("editHistory.by", "username");
}

export const getReportedMessagesByMultipleFields = async (fields: ISearchFields[], query: string, offset: number, limit: number) => {
  if (offset < 1 || limit < 1) {
    throw new AppError("Les paramètres limit et offset doivent être supérieurs à 0", 422);
  }

  // Get reported messages
  const messages: IReportedMessage[] = await Message.find({moderationStatus: "flagged"}).populate("sender", "username").populate("readBy", "username").populate("editHistory.by", "username");

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    let isMessage = false;

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      switch (field.field) {
        case "content":
          isMessage = message.content.toLowerCase().includes(query.toLowerCase()) || isMessage;
          break;
        case "senderUsername":
          isMessage = message.sender.username.toLowerCase().includes(query.toLowerCase()) || isMessage;
          break;
        case "readByUsername":
          const readByUsernames = message.readBy.map((user) => user.username);

          isMessage = readByUsernames.includes(query.toLowerCase()) || isMessage;
          break;
        case "editByUsername":
          const editByUsernames = message.editHistory.map((edit) => edit.by.username);

          isMessage = editByUsernames.includes(query.toLowerCase()) || isMessage;
          break;
        default:
          break;
      }
    }
    return isMessage;
  });

  // Sort messages by date
  const sortedMessages = filteredMessages.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  // Paginate messages
  return sortedMessages.slice(offset - 1, offset - 1 + limit);
}

export const deleteReportedMessage = async (messageId: string, moderatorId: string, reason: string) => {
  // Retrieve Message
  const message = await Message.findOne({_id: messageId});

  // Check if message exists
  if (!message) {
    throw new AppError("Message introuvable", 404);
  }

  // Check if message is already deleted
  if (message.deleted) {
    throw new AppError("Message déjà supprimé", 422);
  }

  // Check if message is flagged
  if (message.moderationStatus !== "flagged") {
    throw new AppError("Message non signalé", 422);
  }

  // Delete message
  message.deleted = true;
  message.deletedBy.push(new ObjectId(moderatorId));
  message.moderationDate = new Date();
  message.moderationStatus = "unapproved";

  await message.save();

  // Create moderation log
  await moderationLogUtil(moderatorId, message.sender.toString(), "delete", reason, messageId);
}