import { userForUser } from "../utils/formatUser.util";
import User from "../models/User.model";
import FriendRequest from "../models/FriendRequest.model";
import Report from "../models/Report.model";
import { createPrivateChat } from "./chat.service";
import { AppError } from "../utils/error.util";
import {
  IActualUser,
  IGetFriends,
  IGetOtherProfile,
  IGetUser,
  IReceivedRequests,
  ISentRequests
} from "../types/social.type";

const friendAndBlockedUsersProjection = async (userId: string, users: IGetUser[]) => {
  // Get users friends and blocked users
  const actualUser: IActualUser = await User.findOne({_id: userId}, {friends: 1, blockedUsers: 1});

  // Add isFriend and isBlocked fields to users
  const formattedUsers: IGetUser[] = users.map((u) => {
    return {
      _id: u._id,
      username: u.username,
      profile: u.profile,
      role: u.role,
      isFriend: !!actualUser.friends.find((friend) => friend.friend.toString() === u._id.toString()),
      isBlocked: !!actualUser.blockedUsers.find((blockedUser) => blockedUser.user.toString() === u._id.toString()),
    };
  });

  return formattedUsers;
}

export const searchUser = async (search: string, limit: number, userId: string) => {
  const queryConditions = {username: {$regex: search, $options: "i"}}
  // Get users
  const users: IGetUser[] = await User.find(queryConditions, {
    _id: 1,
    username: 1,
    profile: 1,
    role: 1
  }).limit(limit);

  // Remove actual user from users
  const userIsInUsers = users.findIndex((u) => u._id.toString() === userId);
  if (userIsInUsers === 0) {
    users.splice(users.findIndex((u) => u._id.toString() === userId), 1);
  }

  // Add isFriend and isBlocked fields to users
  const formattedUser: IGetUser[] = await friendAndBlockedUsersProjection(userId, users);

  return {
    users: formattedUser,
    total: userIsInUsers === 0 ? await User.countDocuments(queryConditions) - 1 : await User.countDocuments(queryConditions),
  };
}

export const getOtherProfile = async (id: string, userId: string) => {
  // Get user
  const user: IGetOtherProfile = await User.findOne({_id: id}, {
    _id: 1,
    username: 1,
    profile: 1,
    role: 1,
    friends: 1,
    blockedUsers: 1,
  });

  // If user does not exist
  if (!user) {
    throw new AppError("Cet utilisateur n'existe pas", 404);
  }

  // Get friends requests
  const friendRequestSendTo = await FriendRequest.findOne({from: userId, to: id});
  const friendRequestReceiveFrom = await FriendRequest.findOne({from: id, to: userId});

  // Format user
  const formattedUser: IGetOtherProfile = {
    _id: user._id,
    username: user.username,
    profile: user.profile,
    role: user.role,
    isFriend: !!user.friends.find((friend) => friend.friend.toString() === userId),
    isBlocked: !!user.blockedUsers.find((blockedUser) => blockedUser.user.toString() === userId),
    friendRequestSent: friendRequestSendTo?._id.toString() || false,
    friendRequestReceived: friendRequestReceiveFrom?._id.toString() || false,
  };

  return formattedUser;
}

export const getFriends = async (userId: string) => {
  // Get user
  const friends: IGetFriends = await User.findOne({_id: userId}, {friends: 1}).populate("friends.friend", 'username _id');

  // Format friends
  return friends.friends.map((friend) => {
    return {
      _id: friend.friend._id,
      username: friend.friend.username
    };
  });
}

export const addFriend = async (userId: string, id: string) => {
  // Check if user is already friend with the other user
  const isFriend = await User.findOne({_id: userId, 'friends.friend': id});
  if (isFriend) {
    throw new AppError("Vous êtes déjà ami avec cet utilisateur", 422);
  }

  // Check if user is blocked by the other user
  const isBlocked = await User.findOne({_id: id, 'blockedUsers.user': userId});
  if (isBlocked) {
    throw new AppError("Cet utilisateur vous a bloqué", 403);
  }

  // Check if request already exists
  const request = await FriendRequest.findOne({$or: [{from: userId, to: id}, {from: id, to: userId}]});
  if (request) {
    throw new AppError("Vous avez déjà reçus ou envoyé une demande", 422);
  }

  // Create request
  const newRequest = new FriendRequest({
    from: userId,
    to: id,
  });

  // Save request
  newRequest.save().then((request) => {
    return request;
  }).catch((error) => {
    throw error;
  });
}

export const getFriendRequests = async (userId: string) => {
  // Retrieve friend requests
  const receivedRequests: IReceivedRequests[] = await FriendRequest.find({to: userId}).populate("from", "username");
  const sentRequests: ISentRequests[] = await FriendRequest.find({from: userId}).populate("to", "username");

  // Format requests
  const formattedRequests = receivedRequests.map((request) => {
    return {
      _id: request._id,
      from: request.from,
      date: request.date,
    };
  });

  const formattedSentRequests = sentRequests.map((request) => {
    return {
      _id: request._id,
      to: request.to,
      date: request.date,
    };
  });

  return {
    receivedRequests: formattedRequests,
    sentRequests: formattedSentRequests,
  };
};

export const acceptFriendRequest = async (userId: string, requestId: string) => {
  // Retrieve request
  const request = await FriendRequest.findOne({_id: requestId});

  // Check if request exists
  if (!request) {
    throw new AppError("La demande n'existe pas", 404);
  }

  // Check if request is for the user
  if (request.to.toString() !== userId) {
    throw new AppError("Vous n'êtes pas autorisé à accepter cette demande", 403);
  }

  // Update users friend
  await User.findOneAndUpdate({_id: userId}, {$push: {friends: {friend: request.from}}});
  await User.findOneAndUpdate({_id: request.from}, {$push: {friends: {friend: userId}}});

  // Create a chat between the two users
  await createPrivateChat([userId, request.from.toString()])

  // Delete request
  await FriendRequest.findOneAndDelete({_id: requestId});
}

export const declineFriendRequest = async (userId: string, requestId: string) => {
  // Retrieve request
  const request = await FriendRequest.findOne({_id: requestId});

  // Check if request exists
  if (!request) {
    throw new AppError("La demande n'existe pas", 404);
  }

  // Check if request is for the user
  if (request.to.toString() !== userId) {
    throw new AppError("Vous n'êtes pas autorisé à refuser cette demande", 403);
  }

  // Delete request
  await FriendRequest.findOneAndDelete({_id: requestId});
}

export const cancelFriendRequest = async (userId: string, requestId: string) => {
  // Retrieve request
  const request = await FriendRequest.findOne({_id: requestId});

  // Check if request exists
  if (!request) {
    throw new AppError("La demande n'existe pas", 404);
  }

  // Check if request is from the user
  if (request.from.toString() !== userId) {
    throw new AppError("Vous n'êtes pas autorisé à annuler cette demande", 403);
  }

  // Delete request
  await FriendRequest.findOneAndDelete({_id: requestId});
}

export const removeFriend = async (userId: string, friendId: string) => {
  // Verify if the user is friend with the other user
  const isFriend = await User.findOne({_id: userId, 'friends.friend': friendId});

  // If the user is not friend with the other user
  if (!isFriend) {
    throw new AppError("Vous n'êtes pas ami avec cet utilisateur", 422);
  }

  // Remove friend from the user's friend list
  await User.updateOne({_id: userId}, {$pull: {friends: {friend: friendId}}});

  // Optionally, remove the user from the friend's friend list
  await User.updateOne({_id: friendId}, {$pull: {friends: {friend: userId}}});

  // Return a message or some confirmation
  return {message: "Ami supprimé avec succès"};
}

export const blockUser = async (userId: string, id: string) => {
  // Verify if the user exists
  const blockedUser = await User.findOne({_id: id});

  // If the user does not exist
  if (!blockedUser) {
    throw new AppError("Cet utilisateur n'existe pas", 404);
  }

  // Get user block list
  const blockedUsers = await User.findOne({_id: userId}, {blockedUsers: 1});

  // Verify if the user is already blocked
  const isAlreadyBlocked = blockedUsers.blockedUsers.find((user) => user.user.toString() === id);

  // If the user is already blocked
  if (isAlreadyBlocked) {
    throw new AppError("Cet utilisateur est déjà bloqué", 422);
  }

  // Block user
  await User.updateOne({_id: userId}, {$push: {blockedUsers: {user: id}}});

  // Verify if the user is friend with the other user
  const isFriend = await User.findOne({_id: userId, 'friends.friend': id});

  // If the user is friend with the other user
  if (isFriend) {
    // Remove friend from the user's friend list
    await User.updateOne({_id: userId}, {$pull: {friends: {friend: id}}});

    // Remove user from the friend's friend list
    await User.updateOne({_id: id}, {$pull: {friends: {friend: userId}}});
  }
}

export const unblockUser = async (userId: string, id: string) => {
  // Verify if the user exists
  const blockedUser = await User.findOne({_id: id});

  // If the user does not exist
  if (!blockedUser) {
    throw new AppError("Cet utilisateur n'existe pas", 404);
  }

  // Get user block list
  const blockedUsers = await User.findOne({_id: userId}, {blockedUsers: 1});

  // Verify if the user is blocked
  const isBlocked = blockedUsers.blockedUsers.find((user) => user.user.toString() === id);

  // If the user is not blocked
  if (!isBlocked) {
    throw new AppError("Cet utilisateur n'est pas bloqué", 422);
  }

  // Unblock user
  await User.updateOne({_id: userId}, {$pull: {blockedUsers: {user: id}}});
}

export const getBlockedUsers = async (userId: string) => {
  // Get user block list
  const blockedUsers = await User.findOne({_id: userId}, {blockedUsers: 1});

  // Get blocked users
  const users = await Promise.all(
    blockedUsers.blockedUsers.map((user) => User.findOne({_id: user.user}))
  );

  // Format users
  return users.map((user) => {
    return userForUser(user);
  });
}

export const reportUser = async (userId: string, id: string, messageId: string, reason: string) => {
  // Verify if the user exists
  const reportedUser = await User.findOne({_id: id});

  // If the user does not exist
  if (!reportedUser) {
    throw new AppError("Cet utilisateur n'existe pas", 404);
  }

  // Create report
  const newReport = new Report({
    userId: id,
    reportedBy: userId,
    messageId,
    reason,
  });

  // Save report
  newReport.save().then((report) => {
    return report;
  }).catch((error) => {
    throw error;
  });
}