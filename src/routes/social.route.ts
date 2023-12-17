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

// POST api/social/remove-friend - Remove friend
router.post("/remove-friend", socialValidator.userIdValidation, socialController.removeFriend);

// POST api/social/block-user - Block user
router.post("/block-user", socialValidator.userIdValidation, socialController.blockUser);

// POST api/social/unblock-user - Unblock user
router.post("/unblock-user", socialValidator.userIdValidation, socialController.unblockUser);

// GET api/social/blocked-users - Get blocked users
router.get("/blocked-users", socialController.getBlockedUsers);

// POST api/social/report-user - Report user
router.post("/report-user", socialValidator.reportUser, socialController.reportUser);

export default router;