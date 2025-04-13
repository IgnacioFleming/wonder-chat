import MongoStore from "connect-mongo";
import config from "./config.ts";

export const mongoStore = MongoStore.create({ mongoUrl: config.mongo_url_dev });
