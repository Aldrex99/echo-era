import { model, Schema } from "mongoose";

const chatSchema = new Schema({
  name: {type: String, required: true},
  description: String,
  isPrivate: {type: Boolean, default: false},
  isPublic: {type: Boolean, default: false},
  participants: [{
    user: {type: Schema.Types.ObjectId, ref: 'User', enum: ['user', 'moderator', 'admin']},
    role: {type: String, default: 'user'},
    date: {type: Date, default: Date.now},
  }],
  messages: [{
    type: Schema.Types.ObjectId, ref: 'Message'
  }],
  createdAt: {type: Date, default: Date.now},
});

const Chat = model('Chat', chatSchema);

export default Chat;