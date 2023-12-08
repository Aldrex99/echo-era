import { model, Schema } from 'mongoose';

const reportSchema = new Schema({
  fromUser: {type: Schema.Types.ObjectId, ref: 'User'},
  toUser: {type: Schema.Types.ObjectId, ref: 'User'},
  message: {type: String, required: true},
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'pending', enum: ['pending', 'resolved', 'rejected']},
});

const Report = model('Report', reportSchema);

export default Report;