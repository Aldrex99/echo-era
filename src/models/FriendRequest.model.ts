import { model, Schema } from "mongoose";

const friendRequestSchema = new Schema({
  from: {type: Schema.Types.ObjectId, ref: 'User'},
  to: {type: Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now},
});

const FriendRequest = model('FriendRequest', friendRequestSchema);

export default FriendRequest;