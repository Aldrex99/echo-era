import { IPersonalUser, IUserMongo } from "../types/user.type";

export const personalUser = (user: IUserMongo): IPersonalUser => {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    profile: user.profile,
    role: user.role,
    isVerified: user.isVerified,
    friends: user.friends,
    blockedUsers: user.blockedUsers,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogout: user.lastLogout,
  };
}