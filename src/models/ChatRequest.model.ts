import { model, Schema } from "mongoose";

const chatRequestSchema = new Schema({
  chatId: {type: Schema.Types.ObjectId, ref: 'Chat'},
  to: {type: Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now},
});

const ChatRequest = model('ChatRequest', chatRequestSchema);

export default ChatRequest;