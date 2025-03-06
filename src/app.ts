import express from "express";
import mongoose from "mongoose";
import config from "./config/config.ts";
import usersRouter from "./routes/users.ts";
import { createCustomError } from "./middleware/error.ts";
import MessageService from "./websockets/MessageService.ts";
import { engine } from "express-handlebars";
import { __dirname } from "./utils/utils.ts";
import viewsRouter from "./routes/views.ts";

export const app = express();

mongoose.connect(config.mongo_url_dev);

app.use(express.json());
app.use(express.static(__dirname + "/dist/src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

app.use("/api/users", usersRouter);
app.use(viewsRouter);

app.use(createCustomError);

const messageService = new MessageService();
messageService.enable();
