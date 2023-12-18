import { ObjectId } from "mongodb";
import { Request } from "express";

export interface IRequestUser extends Request {
  user: {
    id: string;
    role: string;
    iat: number;
    exp: number;
  };
}

export interface IUserCreation {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
}

interface IProfile {
  avatar?: string;
  description?: string;
  birthday?: Date;
  location?: string;
}

interface IPreviousName {
  username: string;
  date?: Date;
}

interface IPreviousEmail {
  email: string;
  date?: Date;
}

interface IWarning {
  reason: string;
  date?: Date;
  by?: string | ObjectId;
}

interface ISanctionReason {
  reason: string;
  date?: Date;
  type: string;
}

interface IFriend {
  friend?: string | ObjectId;
}

interface IBlockedUser {
  user?: string | ObjectId;
  date?: Date;
}

export interface IUserMongo {
  _id: ObjectId;
  username?: string;
  email?: string;
  password?: string;
  profile?: IProfile;
  role?: 'user' | 'moderator' | 'admin';
  previousNames?: IPreviousName[];
  previousEmails?: IPreviousEmail[];
  usernameOnDelete?: string;
  emailOnDelete?: string;
  isActive?: boolean;
  warnings?: IWarning[];
  isMuted?: boolean;
  muteDuration?: number;
  muteExpiresAt?: Date;
  isBanned?: boolean;
  banDuration?: number;
  banExpiresAt?: Date;
  sanctionReason?: ISanctionReason[];
  isVerified?: boolean;
  verificationCode?: string;
  isPasswordReset?: boolean;
  passwordResetCode?: string;
  passwordResetCodeExpiresAt?: Date;
  lastLogout?: Date;
  friends: IFriend[];
  blockedUsers: IBlockedUser[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IPersonalUserUpdate {
  username?: string;
  email?: string;
  profile?: IProfile;
}

export interface IUserForUser {
  id: string;
  username?: string;
  profile?: IProfile;
  role: 'user' | 'moderator' | 'admin';
}

export interface IUserForModeration {
  id: string;
  username?: string;
  email?: string;
  profile?: IProfile;
  role: 'user' | 'moderator' | 'admin';
  previousNames?: IPreviousName[];
  previousEmails?: IPreviousEmail[];
  usernameOnDelete?: string;
  emailOnDelete?: string;
  isActive?: boolean;
  warnings?: IWarning[];
  isMuted?: boolean;
  muteDuration?: number;
  muteExpiresAt?: Date;
  isBanned?: boolean;
  banDuration?: number;
  banExpiresAt?: Date;
  sanctionReason?: ISanctionReason[];
}