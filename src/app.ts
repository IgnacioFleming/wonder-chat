import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.ts";
import { createCustomError } from "./middleware/error.ts";
import MessageService from "./sockets/SocketManager.ts";
import { engine } from "express-handlebars";
import { __dirname } from "./utils/utils.ts";
import viewsRouter from "./routes/views.ts";
import { createServer } from "node:http";
import config from "./config/config.ts";
import SocketManager from "./sockets/SocketManager.ts";

const app = express();
export const server = createServer(app);

mongoose.connect(config.mongo_url_dev);

app.use(express.json());
app.use(express.static(__dirname + "/dist/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/dist/views");
app.use("/api/users", usersRouter);
app.use(viewsRouter);
app.use(createCustomError);

const socket = new SocketManager(server);
socket.connect();
