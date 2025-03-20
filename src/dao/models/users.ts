import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  photo: {
    type: String,
    default: "",
  },
  signup_date: {
    type: String,
    default: Date(),
  },
  last_connection: {
    type: String,
    default: Date(),
  },
  is_online: {
    type: Boolean,
    default: false,
  },
});

export const userModel = mongoose.model(userCollection, userSchema);
