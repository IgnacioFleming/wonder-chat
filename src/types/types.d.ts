import { Errback, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { STATUS_TYPES } from "../utils/status.ts";

export type ObjectId = Types.ObjectId;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type Response = (res: Response, payload?: Object | string, error?: string | { name: string; message: string }) => void;

export type ErrorMiddleware = (err: Errback, req: Request, res: Response, next?: NextFunction) => void;

export interface User {
  full_name: string;
  password: string;
  photo?: string;
  signup_date?: typeof Date;
  last_connection?: typeof Date;
  is_online?: boolean;
}

export interface UserWithId extends User {
  _id: ObjectId;
}

export type AuthUser = Pick<User, "full_name" | "password">;

export interface Message {
  author: ObjectId;
  content: string;
  receiver: ObjectId;
  date?: Date;
  isSent?: boolean;
  isRead?: boolean;
}

export type Conversation = Omit<Message, "isSent" | "receiver" | "content"> & { participants: ObjectId[]; lastMessage: string };

export interface PopulatedConversation extends Conversation {
  participants: UserWithId[];
}
export interface PopulatedConversationWithId extends PopulatedConversation {
  _id: ObjectId;
}
export interface GetMessagesParams {
  userId: string;
  contactId: string;
}
