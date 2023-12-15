import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import * as messageValidator from "../validators/message.validator";

const router: Router = Router();

/* Routes */
// POST api/message/:chatId - Send message
router.post("/:chatId", messageValidator.sendMessage, messageController.sendMessage);

// PUT api/message/:messageId - Edit message
router.put("/:messageId", messageValidator.editMessage, messageController.editMessage);

// DELETE api/message/:messageId - Delete message
router.delete("/:messageId", messageValidator.deleteMessage, messageController.deleteMessage);

// GET api/message/chat/:chatId?limit=10&offset=1 - Get chat messages
router.get("/chat/:chatId", messageValidator.getChatMessages, messageController.getChatMessages);

// GET api/message/search/chatId?search="..."&limit=10&offset=1 - Search messages
router.get("/search/:chatId", messageValidator.searchMessages, messageController.searchMessages);

// POST api/message/report - Report message
router.post("/report", messageValidator.reportMessage, messageController.reportMessage);

export default router;