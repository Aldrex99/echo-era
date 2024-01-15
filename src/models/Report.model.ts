import { model, Schema } from 'mongoose';

const reportSchema = new Schema({
  fromUser: {type: Schema.Types.ObjectId, ref: 'User'},
  toUser: {type: Schema.Types.ObjectId, ref: 'User'},
  messageId: {type: Schema.Types.ObjectId, ref: 'Message'},
  priority: {type: Number, required: true, min: 1, max: 5},
  reasonCategory: {type: String, required: true},
  reason: {type: String, required: true},
  reporterComment: {type: String},
  moderatorComment: [
    {
      moderator: {type: Schema.Types.ObjectId, ref: 'User'},
      comment: {type: String, required: true},
      date: {type: Date, default: Date.now},
    },
  ],
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'pending', enum: ['pending', 'resolved', 'rejected']},
});

const Report = model('Report', reportSchema);

export default Report;