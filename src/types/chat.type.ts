import { Types } from 'mongoose';
import { ObjectId } from "mongodb";

interface IChatParticipant {
  user: string;
  role: 'user' | 'moderator' | 'admin';
}

export interface IChatCreation {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'group';
  participants: IChatParticipant[] | [];
}

export interface IChatUpdate {
  name?: string;
  description?: string;
}

export interface IParticipantMongo {
  date: Date;
  role: 'user' | 'moderator' | 'admin';
  user?: Types.ObjectId;
}

export interface IChatDocumentMongo {
  _id: Types.ObjectId;
  type: 'public' | 'private' | 'group';
  participants: Types.DocumentArray<IParticipantMongo>;
  messages: Types.ObjectId[];
  createdAt: Date;
  name?: string;
  description?: string;
}

export interface IRawChatInfo {
  _id: ObjectId;
  name: string;
  description: string;
  type: "public" | "private" | "group";
  participants: {
    user: {
      _id: ObjectId;
      username: string;
    };
    role: "user" | "moderator" | "admin";
  }[];
  createdAt: Date;
}

export interface IGetChat {
  id: Types.ObjectId;
  name: string;
  description: string;
  type: "public" | "private" | "group";
  participants: {
    id: Types.ObjectId;
    username: string;
    role: "user" | "moderator" | "admin";
  }[];
  createdAt: Date;
}