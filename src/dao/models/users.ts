import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  photo: {
    type: String,
    default: "",
  },
  messages: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "messages",
    },
  ],
  signup_date: {
    type: String,
    default: new Date(),
  },
  last_connection: {
    type: String,
    default: new Date(),
  },
  is_online: Boolean,
});

export const userModel = mongoose.model(userCollection, userSchema);
