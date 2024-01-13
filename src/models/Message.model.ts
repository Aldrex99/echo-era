import { model, Schema } from 'mongoose';

const messageSchema = new Schema({
  sender: {type: Schema.Types.ObjectId, ref: 'User'},
  chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now},
  readBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  deleted: {type: Boolean, default: false},
  deletedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  flaggedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  moderationStatus: {type: String, default: 'none', enum: ['none', 'flagged', 'unapproved', 'approved']},
  moderationDate: {type: Date},
  editHistory: [{
    date: {type: Date, default: Date.now},
    content: {type: String},
    by: {type: Schema.Types.ObjectId, ref: 'User'},
    role: {type: String, enum: ['sender', 'moderator', 'chatOwner']}
  }]
});

const Message = model('Message', messageSchema);

export default Message;