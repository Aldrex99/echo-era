import { model, Schema } from 'mongoose';

const reportReasonSchema = new Schema({
  category: {type: String},
  name: {type: String, required: true},
  priority: {type: Number, required: true, min: 1, max: 5},
});

const ReportReason = model('ReportReason', reportReasonSchema);

export default ReportReason;