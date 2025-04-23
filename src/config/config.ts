import dotenv from "dotenv";

dotenv.config();

export default {
  mongo_url_dev: process.env.NODE_ENV === "production" ? (process.env.MONGO_URL_PROD as string) : (process.env.MONGO_URL_DEV as string),
  secret: process.env.SECRET as string,
};
