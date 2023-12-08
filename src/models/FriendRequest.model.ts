import { model, Schema } from "mongoose";

const friendRequestSchema = new Schema({
  fromUser: {type: Schema.Types.ObjectId, ref: 'User'},
  toUser: {type: Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected']},
});

const FriendRequest = model('FriendRequest', friendRequestSchema);

export default FriendRequest;