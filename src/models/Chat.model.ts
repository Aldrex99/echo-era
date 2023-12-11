import { model, Schema } from "mongoose";

const chatSchema = new Schema({
  name: String,
  description: String,
  type: {type: String, enum: ['public', 'private', 'group'], default: 'private'},
  participants: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    role: {type: String, default: 'user', enum: ['user', 'moderator', 'admin']},
    date: {type: Date, default: Date.now},
  }],
  messages: [{
    type: Schema.Types.ObjectId, ref: 'Message'
  }],
  createdAt: {type: Date, default: Date.now},
});

const Chat = model('Chat', chatSchema);

export default Chat;