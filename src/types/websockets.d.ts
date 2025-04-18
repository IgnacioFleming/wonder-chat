import { MSG_STATUS } from "./consts.ts";
import { ClientMessage, GetMessagesParams, Message, MessageWithId, ObjectId, PopulatedConversationWithId } from "./types.js";

type ClientCallback<T> = (payload: T) => Promise<void>;
type ServerCallback<T> = (payload: T) => void;

export interface ServerToClientEvents {
  sendMessage: ServerCallback<MessageWithId>;
  sendMessages: ServerCallback<MessageWithId[]>;
  register: ServerCallback<string>;
  sendConversations: ServerCallback<{ payload: PopulatedConversationWithId[] }>;
  sendConversation: ServerCallback<{ payload: PopulatedConversationWithId }>;
  updateMessageStatus: ServerCallback<{ messageId: string; status: (typeof MSG_STATUS)[keyof typeof MSG_STATUS] }>;
}

export interface ClientToServerEvents {
  newMessage: ClientCallback<MessageWithId>;
  register: ClientCallback<string>;
  getMessages: ClientCallback<GetMessagesParams>;
  sendMessage: ClientCallback<MessageWithId>;
  getConversations: ClientCallback<{ userId: ObjectId }>;
  sendMessages: ClientCallback<MessageWithId[]>;
  markAllMessagesAsReceived: ClientCallback<{ userId: ObjectId }>;
}
