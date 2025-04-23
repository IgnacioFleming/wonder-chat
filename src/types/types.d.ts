import { Errback, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { STATUS_TYPES } from "../utils/status.ts";
import { MSG_STATUS } from "./consts.ts";
import { STATUSES } from "./enums.js";

export type GeneralId = Types.ObjectId;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type Response = (res: Response, payload?: Object | string, error?: string | { name: string; message: string }) => void;

export type ErrorMiddleware = (err: Errback, req: Request, res: Response, next?: NextFunction) => void;

export type UserId = GeneralId;

export interface User {
  full_name: string;
  password: string;
  photo?: string;
  signup_date?: Date;
  last_connection?: Date;
  is_online?: boolean;
}

export interface UserWithId extends User {
  _id: GeneralId;
}

export type AuthUser = Pick<User, "full_name" | "password">;

export type MessageStatus = (typeof MSG_STATUS)[keyof typeof MSG_STATUS];

export interface Message {
  author: GeneralId;
  content: string;
  receiver: GeneralId;
  date?: Date;
  status?: MessageStatus;
}

export interface MessageWithId extends Message {
  _id: GeneralId;
}

export type Conversation = Omit<Message, "isSent" | "receiver" | "content"> & { participants: GeneralId[]; lastMessage: string; lastMessageId: GeneralId; unreadMessages?: number };

export type ConversationWithId = Conversation & { _id: GeneralId };

export interface PopulatedConversation extends Conversation {
  participants: UserWithId[];
}
export interface PopulatedConversationWithId extends PopulatedConversation {
  _id: GeneralId;
}
export interface GetMessagesParams {
  userId: GeneralId;
  contactId: GeneralId;
}
