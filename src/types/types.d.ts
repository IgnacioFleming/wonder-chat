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
  date?: typeof Date;
  isSent?: boolean;
  isRead?: boolean;
}
type LastMessage = Omit<Message, "isSent" | "receiver" | "_id">;

export interface Conversation {
  participants: ObjectId[];
  lastMessage: LastMessage;
}

export interface PopulatedConversation extends Conversation {
  participants: UserWithId[];
}
export interface GetMessagesParams {
  userId: string;
  contactId: string;
}
