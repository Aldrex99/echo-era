import { Types } from "mongoose";

export interface IRawMessage {
  _id: Types.ObjectId;
  sender: {
    _id: Types.ObjectId;
    username: string;
    profile?: {
      avatar: string;
    };
  };
  chat: Types.ObjectId;
  content: string;
  readBy: {
    _id: Types.ObjectId;
    username: string;
  }[];
  deleted: boolean;
  date: Date;
  editHistory: {
    date: Date;
    content: string;
    by: {
      _id: Types.ObjectId;
      username: string;
    };
    role: "sender" | "moderator" | "chatOwner";
  }[];
}

/*
{
  _id: new ObjectId('6574421760fd1ffbb20ab304'),
  blockedUsers: [
    {
      user: new ObjectId('6574ebf7f60ca382c550bfde'),
      _id: new ObjectId('657cbaab2d4de32bc93901b4'),
      date: 2023-12-15T20:44:27.145Z
    }
  ]
}
 */

export interface IBlockedUser {
  blockedUsers: {
    user: Types.ObjectId;
    _id: Types.ObjectId;
    date: Date;
  }[];
}