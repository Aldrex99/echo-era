import { model, Schema } from 'mongoose';

const analyticSchema = new Schema({
  date: {type: Date, default: Date.now},
  users: {type: Number, default: 0},
  activeUsers: {type: Number, default: 0},
  newUsers: {type: Number, default: 0},
  messagesSent: {type: Number, default: 0},
  messagesReported: {type: Number, default: 0},
  messagesDeleted: {type: Number, default: 0},
  messagesReportedByModerator: {type: Number, default: 0},
  usersBanned: {type: Number, default: 0},
  usersUnbanned: {type: Number, default: 0},
  usersMuted: {type: Number, default: 0},
  usersUnmuted: {type: Number, default: 0},
  usersDeleted: {type: Number, default: 0},
  channelsCreated: {type: Number, default: 0},
  channelsDeleted: {type: Number, default: 0},
});

const Analytic = model('Analytic', analyticSchema);

export default Analytic;