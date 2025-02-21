import express from "express";
import mongoose from "mongoose";
import config from "./config/config.ts";

export const app = express();
mongoose.connect(config.mongo_url_dev);
