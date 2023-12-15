import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import * as chatValidator from "../validators/chat.validator";

const router: Router = Router();

/* Routes */
// POST api/chat - Create a chat
router.post("/", chatValidator.createChat, chatController.createChat);

// GET api/chat/user?limit=1&offset=0 - Get chats of the user
router.get("/user", chatValidator.getUserChats, chatController.getUserChats);

// GET api/chat/get/:id - Get chat info
router.get("/get/:id", chatValidator.getChatInfo, chatController.getChatInfo);

// POST api/chat/add-user/:id - Add user to chat
router.post("/add-user/:id", chatValidator.addUserToChat, chatController.addUserToChat);

// GET api/chat/requests - Get chat request of the user
router.get("/requests", chatController.getChatRequests);

// POST api/chat/accept-chat/:requestId - Accept chat request
router.post("/accept-chat/:requestId", chatValidator.acceptChatRequest, chatController.acceptChatRequest);

// POST api/chat/decline-chat - Decline chat request
router.post("/decline-chat/:requestId", chatValidator.declineChatRequest, chatController.declineChatRequest);

// PUT api/chat/:chatId - Update chat info
router.put("/:chatId", chatValidator.updateChatInfo, chatController.updateChatInfo);

// POST api/chat/update-participant-role/:chatId/:userId - Update participant role
router.post("/update-participant-role/:chatId/:userId", chatValidator.updateChatParticipantRole, chatController.updateChatParticipantRole);

// POST api/chat/remove-participant/:id - Remove participant
router.post("/remove-participant/:id", chatValidator.removeUserFromChat, chatController.removeUserFromChat);

// POST api/chat/leave-chat/:id - Leave chat
router.post("/leave-chat/:id", chatValidator.leaveChat, chatController.leaveChat);

// DELETE api/chat/:id - Delete chat
router.delete("/:id", chatValidator.deleteChat, chatController.deleteChat);

// GET api/chat/search-chat?query="..."&limit=10&offset=10 - Search chat
router.get("/search-chat", chatValidator.searchChats, chatController.searchChats);

export default router;