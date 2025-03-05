import express from "express";
import mongoose from "mongoose";
import config from "./config/config.ts";
import usersRouter from "./routes/users.ts";
import { createCustomError } from "./middleware/error.ts";
import MessageService from "./websockets/MessageService.ts";

export const app = express();
mongoose.connect(config.mongo_url_dev);
app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", usersRouter);
app.use(createCustomError);

const messageService = new MessageService();
messageService.enable();
