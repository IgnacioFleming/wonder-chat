import dotenv from "dotenv";

dotenv.config();

export default {
  mongo_url_dev: process.env.MONGO_URL_DEV as string,
};
