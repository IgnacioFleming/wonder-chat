import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.ts";
import { createCustomError } from "./middleware/error.ts";
import { engine } from "express-handlebars";
import { __dirname } from "./utils/utils.ts";
import viewsRouter from "./routes/views.ts";
import { createServer } from "node:http";
import config from "./config/config.ts";
import SocketManager from "./sockets/SocketManager.ts";
import { reloadClient } from "./config/livereload.ts";
import contactsRouter from "./routes/contacts.ts";
import sessionsRouter from "./routes/sessions.ts";
import { initializePassport } from "./auth/passport.ts";
import session from "express-session";
import passport from "passport";
import { mongoStore } from "./config/sessions.ts";

const app = express();
export const server = createServer(app);
reloadClient(app);
mongoose.connect(config.mongo_url_dev);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/dist/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/dist/views");
app.use(session({ store: mongoStore, secret: config.secret, resave: false, saveUninitialized: false, cookie: { httpOnly: true, maxAge: 30 * 24 * 3600 * 1000, sameSite: "strict" } }));
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/api/users", usersRouter);
app.use(viewsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/sessions", sessionsRouter);

app.use(createCustomError);

const socket = new SocketManager(server);
socket.connect();
