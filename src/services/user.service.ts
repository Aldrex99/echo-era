import User from "../models/User.model";
import { IPersonalUserUpdate } from "../types/user.type";
import { ISearchFields } from "../types/global.type";
import { emailExists, usernameExists } from "./auth.service";
import FriendRequest from "../models/FriendRequest.model";
import { AppError } from "../utils/error.util";
import deletedNameUtil from "../utils/deletedName.util";

// Get user by id
export const getUserById = async (id: string) => {
  return User.findById(id);
}

export const getProfile = async (id: string) => {
  const user = await User.findOne({_id: id}, {
    _id: 1,
    username: 1,
    email: 1,
    profile: 1,
    role: 1,
    isVerifierd: 1,
    lastLogout: 1
  });

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  return user;
}

// Update user
export const updateUser = async (userId: string, data: IPersonalUserUpdate) => {
  const user = await User.findById(userId, {username: 1, email: 1, profile: 1});

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  if (data.username && data.username !== user.username) {
    const usernameAlreadyExists = await usernameExists(data.username);
    if (usernameAlreadyExists.length > 0) {
      throw new AppError("Ce nom d'utilisateur est déjà utilisé", 422);
    }
    user.previousNames.push({username: user.username, date: new Date()});
    user.username = data.username;
  }
  if (data.email && data.email !== user.email) {
    const emailAlreadyExists = await emailExists(data.email);
    if (emailAlreadyExists.length > 0) {
      throw new AppError("Cet email est déjà utilisé", 422);
    }
    user.previousEmails.push({email: user.email, date: new Date()});
    user.email = data.email;
  }

  if (data.profile) {
    if (data.profile.avatar) {
      user.profile.avatar = data.profile.avatar;
    }
    if (data.profile.description) {
      user.profile.description = data.profile.description;
    }
    if (data.profile.birthday) {
      user.profile.birthday = data.profile.birthday;
    }
    if (data.profile.location) {
      user.profile.location = data.profile.location;
    }
  }

  await User.findOneAndUpdate({_id: user._id}, user, {new: true});
}

export const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  const deletedCode = await deletedNameUtil();

  if (user) {
    user.deletedAt = new Date();
    user.emailOnDelete = user.email;
    user.usernameOnDelete = user.username;
    user.username = deletedCode;
    user.email = deletedCode + "@echo-era.com";
    user.password = null;
    user.profile.avatar = null;
    user.isActive = false;
    user.isPasswordReset = false;
    user.passwordResetCode = null;
    user.passwordResetCodeExpiresAt = null;
    user.lastLogout = null;
    user.friends.splice(0, user.friends.length);
    user.blockedUsers.splice(0, user.blockedUsers.length);
    user.save();
  }

  // Delete user in other friends' friends, blockedUsers
  const friends = await User.find({
    $or: [
      {'friends.friend': userId},
      {'blockedUsers.user': userId},
    ]
  });

  // For each friends of the user to delete (friends)
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];

    // Filter friends
    const filteredFriends = friend.friends.filter(f => f.friend.toString() !== userId);
    // Reset and fill DocumentArray friends
    friend.friends.splice(0, friend.friends.length, ...filteredFriends);

    // Filter blockedUsers
    const filteredBlockedUsers = friend.blockedUsers.filter(bu => bu.user.toString() !== userId);
    // Reset and fill DocumentArray blockedUsers
    friend.blockedUsers.splice(0, friend.blockedUsers.length, ...filteredBlockedUsers);

    // Save friend
    await friend.save();
  }

  // Delete user in other friendRequest from/to user to delete
  const requests = await FriendRequest.find({
    $and: [
      {
        $or: [
          {'fromUser': userId},
          {'toUser': userId},
        ]
      },
      {'status': 'pending'}
    ]
  });

  // For each friendRequest of the user to delete (requests)
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];

    // Delete friendRequest
    await request.deleteOne();
  }

  return user;
}

export const getUsersByMultipleFields = async (fields: ISearchFields[], query: string, pages: number, limit: number) => {
  const orFields = fields.map((field) => {
    if (typeof field.field === 'string') {
      if (field.field === '_id') {
        return {[field.field]: {$regex: query}};
      } else {
        return {[field.field]: {$regex: query, $options: 'i'}};
      }
    } else {
      return {[field.field.field]: {$elemMatch: {[field.field.elemMatch]: {$regex: query}}}};
    }
  });

  return {
    result: await User.find({$or: orFields}).skip(pages * limit).limit(limit),
    total: await User.countDocuments({$or: orFields}),
  };
}