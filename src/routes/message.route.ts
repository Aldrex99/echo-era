import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import * as messageValidator from "../validators/message.validator";

const router: Router = Router();

/* Routes */
// POST api/message - Send message
router.post("/", messageValidator.sendMessage, messageController.sendMessage);

// PUT api/message - Edit message
router.put("/", messageValidator.editMessage, messageController.editMessage);

// DELETE api/message - Delete message
router.delete("/", messageValidator.deleteMessage, messageController.deleteMessage);

// GET api/message/chat/:chatId?limit=10&offset=1 - Get chat messages
router.get("/chat/:chatId", messageValidator.getChatMessages, messageController.getChatMessages);

// GET api/message/search/chatId?search="..."&limit=10&offset=1 - Search messages
router.get("/search/:chatId", messageValidator.searchMessages, messageController.searchMessages);

// POST api/message/report - Report message
router.post("/report", messageValidator.reportMessage, messageController.reportMessage);

export default router;