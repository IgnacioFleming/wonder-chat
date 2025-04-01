import { ClientMessage, GetMessagesParams, Message, ObjectId } from "./types.js";

type ClientCallback<T> = (payload: T) => Promise<void>;
type ServerCallback<T> = (payload: T) => void;

export interface ServerToClientEvents {
  sendMessage: ServerCallback<Message>;
  sendMessages: ServerCallback<Message[]>;
  register: ServerCallback<string>;
  sendConversations: ServerCallback<{ payload: PopulatedConversation[] }>;
  sendConversation: ServerCallback<{ payload: PopulatedConversation }>;
}

export interface ClientToServerEvents {
  newMessage: ClientCallback<Message>;
  register: ClientCallback<string>;
  getMessages: ClientCallback<GetMessagesParams>;
  markRead: ClientCallback<{ _id: ObjectId }>;
  sendMessage: ClientCallback<Message>;
  getConversations: ClientCallback<{ userId: ObjectId }>;
}
