import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import * as adminValidator from "../validators/admin.validator";

const router: Router = Router();

// POST api/admin/add-moderator/:userId - Add new moderator
router.post('/add-moderator/:userId', adminValidator.addModerator, adminController.addModerator);

// POST api/admin/remove-moderator/:userId - Remove moderator
router.post('/remove-moderator/:userId', adminValidator.removeModerator, adminController.removeModerator);

// POST api/admin/create-global-chat - Create new global chat
router.post('/create-global-chat', adminValidator.createGlobalChat, adminController.createGlobalChat);

// PUT api/admin/modify-global-chat/:chatId - Modify global chat
router.put('/modify-global-chat/:chatId', adminValidator.modifyGlobalChat, adminController.modifyGlobalChat);

// DELETE api/admin/delete-global-chat/:chatId - Delete global chat
router.delete('/delete-global-chat/:chatId', adminValidator.deleteGlobalChat, adminController.deleteGlobalChat);

// GET api/admin/get-moderation-logs - Get moderation logs
router.get('/get-moderation-logs', adminValidator.getModerationLogs, adminController.getModerationLogs);

export default router;