import Chat from "../models/Chat.model";
import User from "../models/User.model";
import Message from "../models/Message.model";
import { IChatCreation, IChatDocumentMongo, IChatUpdate, IGetChat, IRawChatInfo } from "../types/chat.type";
import ChatRequest from "../models/ChatRequest.model";
import { AppError } from "../utils/error.util";

// Modify chat for get unread messages and last message
const unreadAndLastMessage = async (chats: IChatDocumentMongo[], userId: string) => {
  return await Promise.all(
    chats.map(async (chat) => {
      const notReadMessages = await Message.countDocuments({chat: chat._id, readBy: {$ne: userId}});
      const lastMessage = await Message.findOne({chat: chat._id}).sort({date: -1});
      return {
        chat,
        unreadMessages: notReadMessages,
        lastMessage: lastMessage ? lastMessage.content : null,
        lastMessageDate: lastMessage ? lastMessage.date : null,
      };
    })
  );
}

export const createChat = async (data: IChatCreation, participantsForRequest: string[]) => {
  const newChat = new Chat(data);

  newChat.save().then((chat) => {
    // Add participants to chat with addUserToChat function
    if (data.type === "group") {
      participantsForRequest.forEach((participant) => {
        addUserToChat(chat._id.toString(), participant);
      });
    }
    return chat;
  }).catch((error) => {
    throw error;
  });
}

export const createPrivateChat = async (participantsId: string[]) => {
  // Check if participants are valid
  const participants = await User.find({_id: {$in: participantsId}});
  if (participants.length !== participantsId.length) {
    throw new AppError("Un ou plusieurs utilisateurs n'existent pas", 422);
  }

  // Create chat data
  const data: IChatCreation = {
    name: "",
    description: "",
    type: "private",
    participants: participants.map(participant => {
      return {
        user: participant._id.toString(),
        role: "user",
      }
    }),
  }

  // Create chat
  await createChat(data, participantsId);
}

export const getUserChats = async (userId: string, limit: number, offset: number) => {
  const queryCondition = {$or: [{type: "public"}, {'participants.user': userId}]};

  // Get chats of the user and public chats
  const chats = await Chat.find(queryCondition, {
    __v: 0,
    createdAt: 0,
    messages: 0,
    'participants._id': 0,
    'participants.date': 0,
    'participants.role': 0
  }).skip(offset * limit).limit(limit).populate("participants.user", "username");

  // If chat is private remove user from participants
  chats.forEach((chat) => {
    if (chat.type === "private") {
      // Trouver l'index du participant à retirer
      const index = chat.participants.findIndex(p => p.user._id.toString() === userId.toString());

      // Si le participant est trouvé, retirez-le du tableau
      if (index !== -1) {
        chat.participants.splice(index, 1);
      }
    }
  });

  // Get unread messages and last message for each chat and return the results
  return {
    chats: await unreadAndLastMessage(chats, userId),
    total: await Chat.countDocuments(queryCondition)
  };
}

export const getChatInfo = async (chatId: string): Promise<IGetChat> => {
  const chatInfo: IRawChatInfo = await Chat.findById(chatId, {
    'participants.date': 0,
    messages: 0,
    __v: 0,
  }).populate("participants.user", "username");

  if (!chatInfo) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Format the chat info
  return {
    id: chatInfo._id,
    name: chatInfo.name,
    description: chatInfo.description,
    type: chatInfo.type,
    participants: chatInfo.participants.map((participant) => {
      return {
        id: participant.user._id,
        username: participant.user.username,
        role: participant.role,
      }
    }),
    createdAt: chatInfo.createdAt,
  };
}

export const addUserToChat = async (chatId: string, userId: string) => {
  // Retrieve chat
  const chat = await Chat.findById(chatId);

  // Check if chat exists
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Check if user blocked the chat
  const user = await User.findOne({_id: userId, blockedChats: {$elemMatch: {chat: chatId}}});
  if (user) {
    throw new AppError("Impossible d'envoyer une invitation à cet utilisateur", 403);
  }

  // Check if a request already exists
  const requestExist = await ChatRequest.findOne({to: userId, chatId: chatId});
  if (requestExist) {
    throw new AppError("Une demande a déjà été envoyée à cet utilisateur", 403);
  }

  // Check if user is already in the chat
  const participant = chat.participants.find(participant => participant.user.toString() === userId);
  if (participant) {
    throw new AppError("L'utilisateur fait déjà partie du chat", 403);
  }

  // Sent request to user
  const newRequest = new ChatRequest({
    to: userId,
    chatId: chatId,
  });

  // Save request
  newRequest.save().then((request) => {
    return request;
  }).catch((error) => {
    throw error;
  });
}

export const getChatRequests = async (userId: string) => {
  // Retrieve chat requests
  const chatsInvitation = await ChatRequest.find({to: userId});

  // Retrieve usernames of the request senders and wait for the results
  const fromChats = await Promise.all(
    chatsInvitation.map(request => Chat.findOne({_id: request.chatId}, {name: 1}))
  );

  // Format the requests
  return chatsInvitation.map((request, index) => {
    return {
      id: request._id,
      from: fromChats[index] ? fromChats[index].name : null,
    };
  });
}

const chatRequestExists = async (requestId: string, userId: string) => {
  const request = await ChatRequest.findOne({_id: requestId});

  // Check if request exists
  if (!request) {
    throw new AppError("La demande n'existe pas", 404);
  }

  // Check if request is for the user
  if (request.to.toString() !== userId) {
    throw new AppError("Vous n'êtes pas autorisé à accepter cette demande", 403);
  }

  // Retrieve chat
  const chat = await Chat.findById(request.chatId);

  // Check if chat exists
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Check if user is already in the chat
  const participant = chat.participants.find(participant => participant.user.toString() === userId);
  if (participant) {
    throw new AppError("Vous faites déjà partie du chat", 403);
  }

  return chat;
}

export const acceptChatRequest = async (requestId: string, userId: string) => {
  // Retrieve request
  const chat = await chatRequestExists(requestId, userId);

  // Add user to chat
  chat.participants.push({
    user: userId,
    role: "user",
    date: new Date(),
  });

  // Save chat
  await chat.save();

  // Delete request
  await ChatRequest.findOneAndDelete({_id: requestId});
}

export const declineChatRequest = async (requestId: string, userId: string) => {
  // Retrieve request
  await chatRequestExists(requestId, userId);

  // Delete request
  await ChatRequest.findOneAndDelete({_id: requestId});
}

export const updateChatInfo = async (chatId: string, data: IChatUpdate) => {
  // Retrieve chat
  const chat = await Chat.findById(chatId);

  // Check if chat exists
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Update chat
  await Chat.findOneAndUpdate({_id: chatId}, data);
}

export const updateChatParticipantRole = async (chatId: string, userId: string, role: 'user' | 'moderator' | 'admin') => {
  // Retrieve chat
  const chat = await Chat.findById(chatId);

  // Check if chat exists
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Update chat participant role
  await Chat.findOneAndUpdate({_id: chatId, "participants.user": userId}, {"participants.$.role": role});
}

export const removeUserFromChat = async (chatId: string, userId: string) => {
  // Retrieve chat
  const chat = await Chat.findById(chatId);

  // Check if chat exists
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Check if user is in the chat
  const participant = chat.participants.find(participant => participant.user.toString() === userId);
  if (!participant) {
    throw new AppError("L'utilisateur ne fait pas partie du chat", 403);
  }

  // Remove user from chat
  await Chat.findOneAndUpdate({_id: chatId}, {$pull: {participants: {user: userId}}});
}

export const leaveChat = async (chatId: string, userId: string) => {
  // Retrieve chat
  const chat = await Chat.findById(chatId);

  // Check if chat exists
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Check if user is in the chat
  const participant = chat.participants.find(participant => participant.user.toString() === userId);
  if (!participant) {
    throw new AppError("Vous n'êtes pas dans ce chat", 403);
  }

  // Remove user from chat
  await Chat.findOneAndUpdate({_id: chatId}, {$pull: {participants: {user: userId}}});
}

export const deleteChat = async (chatId: string) => {
  // Retrieve chat
  const chat = await Chat.findById(chatId);

  // Check if chat exists
  if (!chat) {
    throw new AppError("Le chat n'existe pas", 404);
  }

  // Delete chat
  await Chat.findOneAndDelete({_id: chatId});
}

export const searchChats = async (userId: string, search: string, limit: number, offset: number) => {
  if (offset < 1 || limit < 1) {
    throw new AppError("Les paramètres limit et offset doivent être supérieurs à 0", 422);
  }

  // Search chats
  const chats = await Chat.find({$and: [{name: {$regex: search, $options: 'i'}}, {'participants.user': userId}]}, {
    name: 1,
    description: 1,
    type: 1,
    messages: 1
  }).skip(offset - 1).limit(limit);

  // Get unread messages and last message for each chat
  return await unreadAndLastMessage(chats, userId);
}