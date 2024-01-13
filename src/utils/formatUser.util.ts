import { IUserForModeration, IUserMongo } from "../types/user.type";

export const userForModeration = (user: IUserMongo): IUserForModeration => {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    profile: user.profile,
    role: user.role,
    previousNames: user.previousNames,
    previousEmails: user.previousEmails,
    usernameOnDelete: user.usernameOnDelete,
    emailOnDelete: user.emailOnDelete,
    isActive: user.isActive,
    warnings: user.warnings,
    isMuted: user.isMuted,
    muteDuration: user.muteDuration,
    muteExpiresAt: user.muteExpiresAt,
    isBanned: user.isBanned,
    banDuration: user.banDuration,
    banExpiresAt: user.banExpiresAt,
    sanctionReason: user.sanctionReason,
  }
}