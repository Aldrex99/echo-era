import { Types } from "mongoose";

export interface IGetUser {
  _id: Types.ObjectId;
  username?: string;
  profile?: {
    avatar?: string;
    description?: string;
    birthday?: Date;
    location?: string;
  };
  role: string;
  isFriend?: boolean;
  isBlocked?: boolean;
}

export interface IActualUser {
  _id: Types.ObjectId;
  friends: {
    friend: Types.ObjectId;
    _id: Types.ObjectId;
  }[];
  blockedUsers: {
    user: Types.ObjectId;
    _id: Types.ObjectId;
    date: Date;
  }[];
}

export interface IGetOtherProfile extends IGetUser {
  friends?: {
    friend: Types.ObjectId;
    _id: Types.ObjectId;
  }[];
  blockedUsers?: {
    user: Types.ObjectId;
    _id: Types.ObjectId;
    date: Date;
  }[];
  friendRequestSent?: string | boolean;
  friendRequestReceived?: string | boolean;
}

export interface IGetFriends {
  friends: {
    friend: {
      _id: Types.ObjectId;
      username: string;
    };
    _id: Types.ObjectId;
  }[];
}

export interface IReceivedRequests {
  _id: Types.ObjectId;
  from: {
    _id: Types.ObjectId;
    username: string;
  };
  to: Types.ObjectId;
  date: Date;
}

export interface ISentRequests {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  to: {
    _id: Types.ObjectId;
    username: string;
  };
  date: Date;
}