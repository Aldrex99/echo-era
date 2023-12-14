import ModerationLog from "../models/ModerationLog.model";
import { AppError } from "./error.util";

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
  }).catch(() => {
    throw new AppError("Impossible de créer le log de modération", 500)
  });
}