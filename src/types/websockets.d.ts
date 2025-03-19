import { GetMessagesParams, Message, ObjectId } from "./types.js";

type ClientCallback<T> = (payload: T) => Promise<void>;
type ServerCallback<T> = (payload: T) => void;

export interface ServerToClientEvents {
  sendMessage: ServerCallback<Message>;
  sendMessages: ServerCallback<Message[]>;
  register: ServerCallback<string>;
}

export interface ClientToServerEvents {
  newMessage: ClientCallback<Message>;
  getMessages: ClientCallback<GetMessagesParams>;
  markRead: ClientCallback<{ _id: ObjectId }>;
  sendMessage: ClientCallback<Message>;
}
