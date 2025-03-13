import { Errback, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { STATUS_TYPES } from "../utils/status.ts";

export type ObjectId = mongoose.Types.ObjectId;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type Response = (res: Response, payload?: Object, error?: string | { name: string; message: string }) => void;

export type ErrorMiddleware = (err: Errback, req: Request, res: Response, next?: NextFunction) => void;

export interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  photo?: string;
  signup_date?: typeof Date;
  last_connection?: typeof Date;
  is_online?: boolean;
}

export interface Message {
  author: ObjectId;
  content: string;
  receiver: ObjectId;
  date?: typeof Date;
  isSent?: boolean;
  isRead?: boolean;
}

type LastMessage = Omit<Message, "isSent" | "receiver">;

export interface Conversation {
  participants: ObjectId[];
  lastMessage: LastMessage;
}
