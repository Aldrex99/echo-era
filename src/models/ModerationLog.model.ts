import { model, Schema } from "mongoose";

const moderationLogSchema = new Schema({
  moderator: {type: Schema.Types.ObjectId, ref: 'User'},
  affectedUser: {type: Schema.Types.ObjectId, ref: 'User'},
  action: {type: String, required: true},
  reason: {type: String, required: true},
  message: {type: Schema.Types.ObjectId, ref: 'Message'},
  date: {type: Date, default: Date.now},
});

const ModerationLog = model('ModerationLog', moderationLogSchema);

export default ModerationLog;