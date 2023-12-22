import { Router } from "express";
import * as moderationController from "../controllers/moderation.controller";
import * as moderationValidator from "../validators/moderation.validator";

const router: Router = Router();

// GET api/moderation/users?limit=1&offset=0 - Get all users
router.get('/users', moderationValidator.getAllUsers, moderationController.getAllUsers);

// GET api/moderation/search-users - Search users by usernames, previousNames, emails, previousEmails, usernameOnDelete, emailOnDelete
router.get('/search-users', moderationValidator.searchUsers, moderationController.searchUsers);

// GET api/moderation/user/:userId - Get user by id
router.get('/user/:userId', moderationValidator.getUser, moderationController.getUser);

// POST api/moderation/warn/:userId - Warn user
router.post('/warn/:userId', moderationValidator.warnUser, moderationController.warnUser);

// POST api/moderation/unworn/:userId - Unworn user
router.post('/unworn/:userId', moderationValidator.unWarnUser, moderationController.unWornUser);

// POST api/moderation/mute/:id - Mute user
router.post('/mute/:id', moderationValidator.muteUser, moderationController.muteUser);

// POST api/moderation/unmute/:id - Unmute user
router.post('/unmute/:id', moderationValidator.unMuteUser, moderationController.unMuteUser);

// POST api/moderation/ban/:id - Ban user
router.post('/ban/:id', moderationValidator.banUser, moderationController.banUser);

// POST api/moderation/unban/:id - Unban user
router.post('/unban/:id', moderationValidator.unBanUser, moderationController.unBanUser);

// GET api/moderation/warned-users - Get warned users
router.get('/warned-users', moderationController.getAllUsersAreWarnings);

// GET api/moderation/muted-users - Get muted users
router.get('/muted-users', moderationController.getAllUsersAreMuted);

// GET api/moderation/banned-users - Get banned users
router.get('/banned-users', moderationController.getAllUsersAreBanned);

// GET api/moderation/get-reports - Get reports
router.get('/get-reports', moderationValidator.getReports, moderationController.getReports);

// GET api/moderation/search-reports - Search reports
router.get('/search-reports', moderationValidator.searchReports, moderationController.searchReports);

// GET api/moderation/report/:id - Get report by id
router.get('/report/:id', moderationValidator.getReportById, moderationController.getReportById);

// POST api/moderation/change-report-status/:id - Change report status
router.post('/change-report-status/:id', moderationValidator.changeReportStatus, moderationController.changeReportStatus);

// GET api/moderation/reported-messages - Get reported messages
router.get('/reported-messages', moderationController.getReportedMessages);

// GET api/moderation/search-reported-messages - Search reported messages
router.get('/search-reported-messages', moderationValidator.searchReportedMessages, moderationController.searchReportedMessages);

// DELETE api/moderation/delete-message/:id - Delete reported message
router.delete('/delete-message/:id', moderationValidator.deleteReportedMessage, moderationController.deleteReportedMessage);

export default router;