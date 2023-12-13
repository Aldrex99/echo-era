import ModerationLog from "../models/ModerationLog.model";

export const moderationLogUtil = async (moderator: string, affectedUser: string, action: string, reason: string, message?: string) => {
  // Create moderation log
  const newModerationLog = new ModerationLog({
    moderator,
    affectedUser,
    action,
    reason,
    message,
  });

  // Save moderation log
  newModerationLog.save().then((moderationLog) => {
    return moderationLog;
  }).catch((error) => {
    throw error;
  });
}