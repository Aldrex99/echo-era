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