import { Router } from "express";
import * as socialController from "../controllers/social.controller";
import * as socialValidator from "../validators/social.validator";

const router: Router = Router();

/* Routes */
// GET api/social/search?query="..."&limit=10 - Search users by username
router.get("/search", socialController.searchUsers);

// GET api/social/profile/:id - Get other user profile
router.get("/profile/:id", socialController.getOtherProfile);

// GET api/social/friends - Get friends
router.get("/friends", socialController.getFriends);

// POST api/social/add-friend - Add friend
router.post("/add-friend", socialValidator.userIdValidation, socialController.addFriend);

// GET api/social/friend-requests - Get friend requests
router.get("/friend-requests", socialController.getFriendRequests);

// POST api/social/accept-friend - Accept friend
router.post("/accept-friend", socialValidator.requestIdValidation, socialController.acceptFriendRequest);

// POST api/social/refuse-friend - Refuse friend
router.post("/decline-friend", socialValidator.requestIdValidation, socialController.declineFriendRequest);

// POST api/social/cancel-friend - Cancel friend request
router.post("/cancel-friend", socialValidator.requestIdValidation, socialController.cancelFriendRequest);

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