import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  username: {type: String, unique: true, index: true},
  email: {type: String, unique: true, index: true},
  password: {type: String},
  profile: {
    avatar: String,
    description: String,
    birthday: Date,
    location: String,
  },
  role: {type: String, default: 'user', enum: ['user', 'moderator', 'admin', 'server']},
  previousNames: [{
    username: {type: String, required: true},
    date: {type: Date, default: Date.now},
  }],
  previousEmails: [{
    email: {type: String, required: true},
    date: {type: Date, default: Date.now},
  }],
  usernameOnDelete: String,
  emailOnDelete: String,
  isActive: {type: Boolean, default: false},
  reports: {type: Number, default: 0},
  warnings: [{
    reason: {type: String, required: true},
    date: {type: Date, default: Date.now},
    by: {type: Schema.Types.ObjectId, ref: 'User'},
  }],
  isMuted: {type: Boolean, default: false},
  muteDuration: {type: Number, default: 0},
  muteExpiresAt: Date,
  isBanned: {type: Boolean, default: false},
  banDuration: {type: Number, default: 0},
  banExpiresAt: Date,
  sanctionReason: [{
    reason: {type: String, required: true},
    date: {type: Date, default: Date.now},
    type: {type: String, required: true},
  }],
  isVerified: {type: Boolean, default: false},
  verificationCode: String,
  isPasswordReset: {type: Boolean, default: false},
  passwordResetCode: String,
  passwordResetCodeExpiresAt: Date,
  lastLogout: {type: Date, default: Date.now},
  friends: [{
    friend: {type: Schema.Types.ObjectId, ref: 'User'},
  }],
  blockedUsers: [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
  }],
  blockedChats: [{
    chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
    date: {type: Date, default: Date.now},
  }],
  createdAt: {type: Date, default: Date.now},
  updatedAt: Date,
  deletedAt: Date,
});

const User = model('User', userSchema);

export default User;