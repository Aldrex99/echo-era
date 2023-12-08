import { model, Schema } from 'mongoose';

const messageSchema = new Schema({
  sender: {type: Schema.Types.ObjectId, ref: 'User'},
  chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now},
  readBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  flaggedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  moderationStatus: {type: String, default: 'pending', enum: ['flagged', 'deleted', 'approved']},
});

const Message = model('Message', messageSchema);

export default Message;