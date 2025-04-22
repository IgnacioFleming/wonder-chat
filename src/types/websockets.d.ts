import { MSG_STATUS } from "./consts.ts";
import { ClientMessage, GetMessagesParams, Message, MessageWithId, GeneralId, PopulatedConversationWithId } from "./types.js";

type ClientCallback<T> = (payload: T) => Promise<void>;
type ServerCallback<T> = (payload: T) => void;

export interface ServerToClientEvents {
  sendMessage: ServerCallback<MessageWithId>;
  sendMessages: ServerCallback<MessageWithId[]>;
  register: ServerCallback<string>;
  sendConversations: ServerCallback<{ payload: PopulatedConversationWithId[] }>;
  sendConversation: ServerCallback<{ payload: PopulatedConversationWithId }>;
  updateMessageStatus: ServerCallback<{ message: MessageWithId; status: (typeof MSG_STATUS)[keyof typeof MSG_STATUS] }>;
  notifyConnection: ServerCallback<{ userId: string; is_online: boolean; last_connection: Date | undefined }>;
}

export interface ClientToServerEvents {
  newMessage: ClientCallback<MessageWithId>;
  register: ClientCallback<string>;
  sendMessage: ClientCallback<MessageWithId>;
  getMessages: ClientCallback<GetMessagesParams>;
  getConversations: ClientCallback<{ userId: GeneralId }>;
  sendMessages: ClientCallback<MessageWithId[]>;
  markAllMessagesAsReceived: ClientCallback<{ userId: GeneralId }>;
  updateMessagesToRead: ClientCallback<{ userId: GeneralId; contactId: GeneralId }>;
}
