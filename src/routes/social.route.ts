import { Router } from "express";
import * as socialController from "../controllers/social.controller";
import * as socialValidator from "../validators/social.validator";

const router: Router = Router();

/* Routes */
// GET api/social/search?search="..."&limit=10 - Search users by username
router.get("/search", socialValidator.searchUsers, socialController.searchUsers);

// GET api/social/profile/:otherUserId - Get other user profile
router.get("/profile/:otherUserId", socialValidator.getOtherProfile, socialController.getOtherProfile);

// GET api/social/friends - Get friends
router.get("/friends", socialController.getFriends);

// POST api/social/add-friend/:receiverId - Add friend
router.post("/add-friend/:receiverId", socialValidator.addFriend, socialController.addFriend);

// GET api/social/friend-requests - Get friend requests
router.get("/friend-requests", socialController.getFriendRequests);

// POST api/social/accept-friend/:requestId - Accept friend
router.post("/accept-friend/:requestId", socialValidator.acceptFriendRequest, socialController.acceptFriendRequest);

// POST api/social/refuse-friend/:requestId - Refuse friend
router.post("/decline-friend/:requestId", socialValidator.declineFriendRequest, socialController.declineFriendRequest);

// POST api/social/cancel-friend/:requestId - Cancel friend request
router.post("/cancel-friend/:requestId", socialValidator.cancelFriendRequest, socialController.cancelFriendRequest);

// POST api/social/remove-friend/:friendId - Remove friend
router.post("/remove-friend/:friendId", socialValidator.removeFriend, socialController.removeFriend);

// POST api/social/block-user/:otherUserId - Block user
router.post("/block-user/:otherUserId", socialValidator.blockUser, socialController.blockUser);

// POST api/social/unblock-user/:blockedId - Unblock user
router.post("/unblock-user/:blockedId", socialValidator.unblockUser, socialController.unblockUser);

// GET api/social/blocked-users - Get blocked users
router.get("/blocked-users", socialController.getBlockedUsers);

// POST api/social/block-chat/:chatId - Block chat
router.post("/block-chat/:chatId", socialValidator.blockChat, socialController.blockChat);

// POST api/social/unblock-chat/:chatId - Unblock chat
router.post("/unblock-chat/:chatId", socialValidator.unblockChat, socialController.unblockChat);

// GET api/social/blocked-chats - Get blocked chats
router.get("/blocked-chats", socialController.getBlockedChats);

// POST api/social/report-user/:otherUserId - Report user
router.post("/report-user/:otherUserId", socialValidator.reportUser, socialController.reportUser);

export default router;